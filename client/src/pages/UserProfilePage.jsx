import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../hooks/useAuth';
import UserProfileView from './UserProfileView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import Spinner from '../components/common/Spinner';

const UserProfilePage = () => {
    const { userId } = useParams();
    const { user: loggedInUser, setUser: setLoggedInUser, allUsers: contextAllUsers, fetchPosts, updatePostState, deletePost: deletePostFromContext } = useAppContext();
    const navigate = useNavigate();

    const [profileToDisplay, setProfileToDisplay] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    const fetchUserPosts = async (profileId) => {
        if (!loggedInUser?.token || !profileId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            const endpoint = (loggedInUser?._id === profileId) ? '/api/posts/myposts' : `/api/posts/user/${profileId}`;
            const { data } = await axios.get(endpoint, config);
            const sortedData = data.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
            setUserBlogs(sortedData || []);
        } catch (err) {
            console.error(`Error fetching posts for user ${profileId}:`, err);
            setError(err.response?.data?.message || 'Failed to load posts.');
        }
    };

    useEffect(() => {
        const fetchUserProfileAndPosts = async () => {
            if (!userId) { setError("No user ID provided in URL."); setLoading(false); return; }
            if (!loggedInUser?.token) { setError("Login required to view profiles."); setLoading(false); return; }
            setLoading(true);
            setError(null);
            setUserBlogs([]);
            setProfileToDisplay(null);
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                const { data: profileData } = await axios.get(`/api/users/${userId}`, config);
                if (profileData?._id) {
                    setProfileToDisplay(profileData);
                    await fetchUserPosts(profileData._id);
                } else {
                    setError('User profile data not found.');
                }
            } catch (err) {
                 console.error("Error fetching profile:", err);
                 const message = err.response?.status === 404 ? 'User not found.' : (err.response?.data?.message || err.message || 'Failed to load profile.');
                 setError(message);
            } finally {
                 setLoading(false);
            }
        };
        fetchUserProfileAndPosts();
    }, [userId, loggedInUser?.token]);

    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => {
         let modalData = { ...data };
         if (type === 'search') {
             modalData = { ...data, allUsers: contextAllUsers, blogs: userBlogs };
         } else if (type === 'likers' && Array.isArray(data)) {
             const likerIds = data.map(like => typeof like === 'string' ? like : (like._id || like.id)).filter(Boolean);
             modalData = contextAllUsers.filter(u => likerIds.includes(u._id || u.id));
         } else if ((type === 'followers' || type === 'following') && data && Array.isArray(data.list)) {
             const userIds = data.list.map(item => typeof item === 'string' ? item : (item._id || item.id)).filter(Boolean);
             const userList = contextAllUsers.filter(u => userIds.includes(u._id || u.id));
             modalData = { ...data, list: userList };
         }
         setModalContent({ type, data: modalData });
     };

    const handleProfileUpdate = async (updatedData) => {
         if (!loggedInUser || loggedInUser._id !== userId) return;
         try {
             const config = { headers: { Authorization: `Bearer ${loggedInUser.token}`, 'Content-Type': 'application/json' } };
             const { data: updatedUser } = await axios.put('/api/users/profile', updatedData, config);
             const finalUpdatedUser = { ...updatedUser, id: updatedUser._id };
             setProfileToDisplay(finalUpdatedUser);
             setLoggedInUser(finalUpdatedUser);
             closeModal();
         } catch(err) {
             console.error("Failed to update profile", err);
             setError(err.response?.data?.message || 'Failed to update profile.');
         }
    };

    const handleBlogSubmit = async (blogData) => {
         const isEditing = !!blogData.id || !!blogData._id;
         const postId = blogData.id || blogData._id;
         try {
             const config = { headers: { Authorization: `Bearer ${loggedInUser.token}`, 'Content-Type': 'application/json' } };
             const { id, _id, ...payload } = blogData;
             if (isEditing && postId) { await axios.put(`/api/posts/${postId}`, payload, config); }
             else { await axios.post('/api/posts', payload, config); }
             if(profileToDisplay?._id){ await fetchUserPosts(profileToDisplay._id); }
             closeModal();
         } catch (err) {
             console.error("Failed to save post", err);
             setError(err.response?.data?.message || "Failed to save post.");
         }
    };

    const handleDelete = async (blogId) => {
         if (window.confirm('Are you sure you want to delete this post?')) {
             try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                await axios.delete(`/api/posts/${blogId}`, config);
                setUserBlogs(prevBlogs => prevBlogs.filter(blog => (blog._id || blog.id) !== blogId));
            } catch (err) {
                console.error('Failed to delete post', err);
                setError(err.response?.data?.message || 'Failed to delete post');
            }
        }
    };

    const handleFollow = (idToFollow) => {
        console.log(`Toggling follow for user ID: ${idToFollow}`);
        setError("Follow functionality not implemented yet.");
    };

    if (loading) { return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>; }
    if (error && !profileToDisplay) { return <div className="pt-24 text-center text-red-500 text-lg">{error}</div>; }
    if (!profileToDisplay) { return <div className="pt-24 text-center text-lg">User profile could not be loaded.</div>; }
    const postLoadingError = error ? error : null;

    return (
        <>
            <UserProfileView
                profile={profileToDisplay}
                blogs={userBlogs}
                currentUser={loggedInUser}
                onFollow={handleFollow}
                allUsers={contextAllUsers}
                openModal={openModal}
                onDeletePost={handleDelete}
                postError={postLoadingError}
            />
            {modalContent && (
                <Modal onClose={closeModal} title={modalContent.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} size={modalContent.type === 'createPost' || modalContent.type === 'editProfile' ? 'xl' : 'md'}>
                    <ModalContent
                        type={modalContent.type}
                        data={modalContent.data}
                        onSaveBlog={handleBlogSubmit}
                        onSaveProfile={handleProfileUpdate}
                        onClose={closeModal}
                        currentUser={loggedInUser}
                        onFollow={handleFollow}
                        onProfileClick={(user) => { 
                            const navUserId = user._id || user.id;
                            if (navUserId) { navigate(`/profile/${navUserId}`) }
                            else { console.error("ModalContent: Cannot navigate, user ID missing", user) }
                        }}
                        allUsers={contextAllUsers}
                        openModal={openModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default UserProfilePage;