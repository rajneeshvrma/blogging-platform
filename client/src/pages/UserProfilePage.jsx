import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../hooks/useAuth';
import { userService } from '../api/userService';
import UserProfileView from './UserProfileView';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
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
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [isFollowingProcessing, setIsFollowingProcessing] = useState(false);

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
             modalData = { ...data, allUsers: contextAllUsers || [], blogs: userBlogs || [] };
         }
         else if (type === 'likers' && Array.isArray(data)) {
             const likerIds = data.map(like => typeof like === 'string' ? like : (like._id || like.id)).filter(Boolean);
             const resolvedLikers = Array.isArray(contextAllUsers) ? contextAllUsers.filter(u => likerIds.includes(u._id || u.id)) : [];
             modalData = resolvedLikers; 
         }
         else if ((type === 'followers' || type === 'following') && data && Array.isArray(data.list)) {
            const userIds = data.list.map(item => typeof item === 'string' ? item : (item._id || item.id)).filter(Boolean);
            const resolvedUserList = Array.isArray(contextAllUsers) ? contextAllUsers.filter(u => userIds.includes(u._id || u.id)) : [];
            modalData = { ...data, list: resolvedUserList };
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
        } catch (err) {
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
            if (profileToDisplay?._id) { await fetchUserPosts(profileToDisplay._id); }
            closeModal();
        } catch (err) {
            console.error("Failed to save post", err);
            setError(err.response?.data?.message || "Failed to save post.");
        }
    };

    const handleDelete = (blogId) => {
        setConfirmMessage('Are you sure you want to delete this post? This action cannot be undone.');
        setConfirmData(blogId);
        setConfirmAction(() => async () => { 
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                await axios.delete(`/api/posts/${blogId}`, config);
                setUserBlogs(prevBlogs => prevBlogs.filter(blog => (blog._id || blog.id) !== blogId));
            } catch (err) {
                console.error('Failed to delete post', err);
                setError(err.response?.data?.message || 'Failed to delete post');
                alert(`Failed to delete post: ${err.response?.data?.message || 'Please try again.'}`);
            }
        });
        setConfirmModalOpen(true);
    };

    const handleConfirm = async () => {
        if (typeof confirmAction === 'function') {
            await confirmAction(); 
        }
        setConfirmModalOpen(false); 
        setConfirmAction(null);
        setConfirmData(null);
    };

    const handleCancelConfirm = () => {
        setConfirmModalOpen(false);
        setConfirmAction(null);
        setConfirmData(null);
    };

    const handleFollow = async (idToToggle) => {
        if (!loggedInUser || isFollowingProcessing) return;
        setIsFollowingProcessing(true); setError(null);
        try {
            const updatedFollowingList = await userService.toggleFollow(idToToggle);
            setLoggedInUser({ ...loggedInUser, following: updatedFollowingList });
            const wasFollowing = loggedInUser.following.some(id => id === idToToggle);
            setProfileToDisplay(prevProfile => {
                if (!prevProfile) return null;
                const currentFollowers = prevProfile.followers || [];
                let newFollowers;
                if (wasFollowing) { newFollowers = currentFollowers.filter(id => id !== loggedInUser._id); }
                else { newFollowers = [...currentFollowers, loggedInUser._id]; }
                return { ...prevProfile, followers: newFollowers };
            });
        } catch (err) {
            console.error("Failed to toggle follow", err);
            const errorMsg = err.response?.data?.message || 'Could not update follow status.';
            setError(errorMsg); alert(`Error: ${errorMsg}`);
        } finally {
            setIsFollowingProcessing(false);
        }
    };
    

    if (loading) { return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>; }
    if (error && !profileToDisplay) { return <div className="pt-24 text-center text-red-500 text-lg">{error}</div>; }
    if (!profileToDisplay) { return <div className="pt-24 text-center text-lg">User profile could not be loaded.</div>; }
    const postLoadingError = error ? error : null;

    const coverPhotoUrl = profileToDisplay.coverPhoto || `https://placehold.net/7-600x800.png`;

    return (<div className="relative min-h-screen isolate">
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center opacity-15"
                style={{ backgroundImage: `url(${coverPhotoUrl})` }}
                aria-hidden="true"
            />
            <div className="relative z-0">
                <UserProfileView
                    profile={profileToDisplay}
                    blogs={userBlogs}
                    currentUser={loggedInUser}
                    onFollow={handleFollow}
                    allUsers={contextAllUsers}
                    openModal={openModal}
                    onDeletePost={handleDelete}
                    postError={postLoadingError}
                    isFollowingProcessing={isFollowingProcessing}
                />
            </div>
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
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={handleCancelConfirm}
                onConfirm={handleConfirm}
                title="Confirm Deletion"
                message={confirmMessage}
                confirmText="Delete"
            />
        </div>
    );
};

export default UserProfilePage;