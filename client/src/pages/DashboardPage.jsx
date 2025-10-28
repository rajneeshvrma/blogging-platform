import React, { useState, useEffect } from 'react';
import DashboardView from './DashboardView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAuth';
import { postService } from '../api/postService';
import Spinner from '../components/common/Spinner';

export default function DashboardPage() {
    const [modalContent, setModalContent] = useState(null);
    const [visibleBlogs, setVisibleBlogs] = useState(5);
    const navigate = useNavigate();
    const {
        user: currentUser,
        setUser: setCurrentUser,
        posts,
        allUsers,
        updatePostState,
        fetchPosts,
        loading: contextLoading,
        addPost: addPostToContext, 
        deletePost: deletePostFromContext
    } = useAppContext();

    useEffect(() => {
        if (!contextLoading && currentUser && posts.length === 0) {
            console.log("Dashboard attempting initial post fetch...");
            fetchPosts().catch(err => console.error("Dashboard initial fetch failed:", err));
        }
    }, [contextLoading, currentUser, posts.length, fetchPosts]);

    const feedPosts = React.useMemo(() => {
        return posts
            .filter(post => post.status === 'published' || !post.status)
            .sort((a, b) => new Date(b.publishedAt || b.createdAt || b.timestamp) - new Date(a.publishedAt || a.createdAt || a.timestamp));
    }, [posts]);

    const handleLike = async (blogId) => {
        if (!currentUser || !blogId) return;
        const post = posts.find(p => (p.id || p._id) === blogId);
        if (!post) return;
        const currentUserId = currentUser._id || currentUser.id;
        const isLiked = Array.isArray(post.likes) && post.likes.some(like => (typeof like === 'string' && like === currentUserId) || (typeof like === 'object' && like !== null && (like._id === currentUserId || like.id === currentUserId)));
        try {
            const action = isLiked ? postService.unlikePost : postService.likePost;
            await action(blogId);
            const refreshedPost = await postService.getPostById(blogId);
            if (refreshedPost) { updatePostState(refreshedPost); }
            else { console.warn(`Post ${blogId} not found after like/unlike.`); await fetchPosts(); }
        } catch (error) { console.error("Failed to toggle like:", error.response?.data?.message || error.message); }
    };

    const handleComment = async (blogId, text) => {
         if (!text || !currentUser || !blogId) {
             console.error("handleComment: Missing data", { text, currentUser, blogId });
             return;
         };
         console.log(`Attempting to add comment '${text}' to post ${blogId}`); 
         try {
             await postService.addComment(blogId, text);
             console.log(`Comment added via service for post ${blogId}`); 
             
             const refreshedPost = await postService.getPostById(blogId);
             if (refreshedPost) {
                 console.log(`Refreshed post ${blogId} after comment:`, refreshedPost); 
                 updatePostState(refreshedPost); 
             } else {
                 console.warn(`Post ${blogId} not found after adding comment. Refetching all.`);
                 await fetchPosts(); 
             }
         } catch (error) {
             console.error(`Failed to add comment to post ${blogId}:`, error.response?.data?.message || error.message);
             
             alert(`Failed to add comment: ${error.response?.data?.message || 'Please try again.'}`);
         }
     };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try { await deletePostFromContext(blogId); }
            catch (error) { console.error("Failed to delete post:", error.response?.data?.message || error.message); }
        }
    };

    const handleBlogSubmit = async (blogData) => {
        try { await addPostToContext(blogData); closeModal(); } 
        catch (error) { console.error("Failed to save blog post:", error.response?.data?.message || error.message); }
    };

    const handleProfileUpdate = (updatedProfile) => {
        console.log("Updating profile in Dashboard context:", updatedProfile);
        setCurrentUser(updatedProfile);
        closeModal();
    };

    const handleFollow = (userId) => {
        console.log("Follow action triggered for user:", userId);
    };

    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => {
        let modalData = { ...data };
        if (type === 'search') { modalData = { ...data, allUsers: allUsers, blogs: posts }; }
        else if (type === 'likers' && Array.isArray(data)) { const likerIds = data.map(like => typeof like === 'string' ? like : (like._id || like.id)).filter(Boolean); modalData = allUsers.filter(u => likerIds.includes(u._id || u.id)); }
        else if ((type === 'followers' || type === 'following') && data && Array.isArray(data.list)) { const userIds = data.list.map(item => typeof item === 'string' ? item : (item._id || item.id)).filter(Boolean); const userList = allUsers.filter(u => userIds.includes(u._id || u.id)); modalData = { ...data, list: userList }; }
        setModalContent({ type, data: modalData });
    };

    const navigateToProfile = (userToNav) => {
        closeModal();
        console.log("navigateToProfile called with:", userToNav);
        const userId = userToNav?.id || userToNav?._id; 
        if (userId && typeof userId === 'string') {
            console.log("Extracted ID:", userId, "Navigating to:", `/profile/${userId}`);
            navigate(`/profile/${userId}`);
        } else {
            console.error("Cannot navigate: Invalid user object or could not extract string ID.", userToNav);
            alert("Could not navigate to profile. Invalid user data.");
        }
    };

    if (contextLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <Spinner />
            </div>
        );
    }

    if (!currentUser) {
        return <div className="pt-24 text-center text-lg text-text-secondary">Please log in to view the dashboard.</div>;
    }

    return (
        <>
            <DashboardView
                blogs={feedPosts}
                currentUser={currentUser}
                allUsers={allUsers}
                visibleBlogs={visibleBlogs}
                setVisibleBlogs={setVisibleBlogs}
                handleLike={handleLike}
                handleComment={handleComment}
                handleDelete={handleDelete}
                openModal={openModal}
                navigateTo={navigateToProfile}
                onFollow={handleFollow}
            />
            {modalContent && (
                <Modal onClose={closeModal} title={modalContent.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} size={modalContent.type === 'createPost' || modalContent.type === 'editProfile' ? 'xl' : 'md'}>
                    <ModalContent
                        type={modalContent.type}
                        data={modalContent.data}
                        onSaveBlog={handleBlogSubmit}
                        onSaveProfile={handleProfileUpdate}
                        onClose={closeModal}
                        currentUser={currentUser}
                        onFollow={handleFollow}
                        onProfileClick={navigateToProfile}
                        allUsers={allUsers}
                        openModal={openModal}
                        blogs={posts}
                    />
                </Modal>
            )}
        </>
    );
}