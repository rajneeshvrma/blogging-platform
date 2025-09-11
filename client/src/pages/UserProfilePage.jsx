import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfileView from './UserProfileView';
import { ALL_USERS, generateDummyBlogs } from '../data/dummyData';
import { useAppContext } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';

// This is now a "smart" component that manages its own data and modals.
const UserProfilePage = () => {
    const { userId } = useParams();
    const { user: loggedInUser } = useAppContext();
    const navigate = useNavigate();

    // State for this page's data
    const [profileToDisplay, setProfileToDisplay] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ADDED: State for managing modals (edit profile, create post, etc.)
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        setLoading(true);
        const profile = ALL_USERS.find(u => u.id === parseInt(userId, 10));
        const blogs = generateDummyBlogs(50).filter(blog => blog.author.id === parseInt(userId, 10));
        
        setProfileToDisplay(profile);
        setUserBlogs(blogs);
        setLoading(false);
    }, [userId]);

    // --- ADDED: Handler functions for this page ---
    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => setModalContent({ type, data });

    // Placeholder for handling profile updates
    const handleProfileUpdate = (updatedProfile) => {
        console.log("Profile updated:", updatedProfile);
        // In a real app, you would update the state and make an API call here.
        closeModal();
    };

    // Placeholder for handling new blog submissions
    const handleBlogSubmit = (blogData) => {
        console.log("New blog submitted:", blogData);
        // In a real app, you would add the new blog to the state and make an API call.
        closeModal();
    };
    
    // Placeholder for the follow action
    const handleFollow = (id) => console.log(`Toggling follow for user ID: ${id}`);


    if (loading) return <div className="text-center py-20">Loading profile...</div>;
    if (!profileToDisplay) return <div className="text-center py-20">User not found.</div>;

    return (
        <>
            <UserProfileView
                profile={profileToDisplay}
                blogs={userBlogs}
                currentUser={loggedInUser}
                onFollow={handleFollow}
                allUsers={ALL_USERS}
                // Pass the modal functions to the view
                openModal={openModal}
            />

            {/* ADDED: Modal rendering logic for the profile page */}
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
                        onProfileClick={(user) => navigate(`/profile/${user.id}`)}
                        allUsers={ALL_USERS}
                        openModal={openModal}
                    />
                </Modal>
            )}
        </>
    );
};

export default UserProfilePage;