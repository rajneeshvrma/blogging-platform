import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../hooks/useAuth';
import UserProfileView from './UserProfileView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import Spinner from '../components/common/Spinner';

const UserProfilePage = () => {
    const { userId } = useParams();
    
    
    const { user: loggedInUser, setUser: setLoggedInUser, deletePost: deletePostFromContext } = useAppContext();
    const navigate = useNavigate();

    const [profileToDisplay, setProfileToDisplay] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    
    const fetchUserPosts = async (profileId) => {
        if (!loggedInUser?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            let postsData = [];
            const isOwnProfile = loggedInUser?._id === profileId;
            if (isOwnProfile) {
                
                const { data } = await axios.get('/api/posts/myposts', config);
                postsData = data;
            } else {
                
                const { data } = await axios.get(`/api/posts/user/${profileId}`, config);
                postsData = data;
            }
             
             postsData.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
            setUserBlogs(postsData);
        } catch (err) {
            console.error("Error fetching user posts:", err);
            
             if (!profileToDisplay) { 
                setError(err.response?.data?.message || 'Failed to load posts.');
             }
        }
    };

    
    useEffect(() => {
        const fetchUserProfileAndPosts = async () => {
            if (!loggedInUser?.token) {
                 setError("Login required.");
                 setLoading(false);
                 return;
             }
            setLoading(true);
            setError(null);
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                const { data: profileData } = await axios.get(`/api/users/${userId}`, config);
                setProfileToDisplay(profileData);
                
                if (profileData?._id) {
                     await fetchUserPosts(profileData._id);
                } else {
                     setUserBlogs([]); 
                }
            } catch (err) {
                 console.error("Error fetching profile:", err);
                 const message = err.response?.data?.message || err.message || 'Failed to load profile.';
                 setError(message);
                 setProfileToDisplay(null);
                 setUserBlogs([]); 
            } finally {
                 setLoading(false);
            }
        };
        fetchUserProfileAndPosts();
    
    }, [userId, loggedInUser?.token]);

    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => setModalContent({ type, data });

    
    const handleProfileUpdate = async (updatedData) => {
         console.log("Profile update data:", updatedData);
         try {
             const config = {
                 headers: {
                     Authorization: `Bearer ${loggedInUser.token}`,
                     'Content-Type': 'application/json',
                 },
             };
             const { data: updatedUser } = await axios.put('/api/users/profile', updatedData, config);
             if (loggedInUser._id === updatedUser._id) {
                 setLoggedInUser(updatedUser); 
                 setProfileToDisplay(updatedUser); 
             }
             console.log("Profile updated successfully:", updatedUser);
         } catch(err) {
             console.error("Failed to update profile", err);
             
         }
         closeModal();
    };


    
    const handleBlogSubmit = async (blogData) => {
        console.log("Blog data to save:", blogData);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                    'Content-Type': 'application/json',
                },
            };

            
            if (blogData._id) {
                
                const postId = blogData._id;
                
                const { id, _id, ...updateData } = blogData;
                await axios.put(`/api/posts/${postId}`, updateData, config);
            } else {
                
                await axios.post('/api/posts', blogData, config);
            }

            
            
            if(profileToDisplay?._id){
                fetchUserPosts(profileToDisplay._id); 
            }

        } catch (err) {
            console.error("Failed to save post", err);
            setError("Failed to save post."); 
        }
        closeModal();
    };
    

    
    const handleDelete = async (blogId) => {
         if (window.confirm('Are you sure you want to delete this post?')) {
             try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                await axios.delete(`/api/posts/${blogId}`, config);
                
                 if(profileToDisplay?._id){
                    fetchUserPosts(profileToDisplay._id);
                }
                
                
            } catch (err) {
                console.error('Failed to delete post', err);
                setError('Failed to delete post'); 
            }
        }
    };
    

    const handleFollow = (idToFollow) => {
        console.log(`Toggling follow for user ID: ${idToFollow}`);
    };

    if (loading) { return <div className="flex justify-center items-center h-screen"><Spinner /></div>; }
    if (error && !profileToDisplay) { return <div className="text-center py-20 text-red-500">{error}</div>; } 
    if (!profileToDisplay) { return <div className="text-center py-20">User not found.</div>; }

    
    const postError = error && profileToDisplay ? error : null;


    return (
        <>
            <UserProfileView
                profile={profileToDisplay}
                blogs={userBlogs}
                currentUser={loggedInUser}
                onFollow={handleFollow}
                allUsers={[]} 
                openModal={openModal}
                
                onDeletePost={handleDelete}
                postError={postError} 
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
                        
                        onProfileClick={(user) => navigate(`/profile/${user._id || user.id}`)}
                        allUsers={[]} 
                        openModal={openModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default UserProfilePage;