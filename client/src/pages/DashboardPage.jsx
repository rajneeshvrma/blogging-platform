import React, { useState, useEffect } from 'react';
import { generateDummyBlogs, ALL_USERS, CURRENT_USER_ID } from '../data/dummyData';
import DashboardView from './DashboardView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const [blogs, setBlogs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalContent, setModalContent] = useState(null);
    const [visibleBlogs, setVisibleBlogs] = useState(5);
    const navigate = useNavigate(); // Using react-router's navigate function

    // Fetch initial data
    useEffect(() => {
        // This simulates fetching data when the component mounts
        const users = ALL_USERS;
        const initialUser = { ...users.find(u => u.id === CURRENT_USER_ID), followers: [103, 104, 106, 107], following: [102, 105] };
        setBlogs(generateDummyBlogs(50));
        setAllUsers(users);
        setCurrentUser(initialUser);
        setLoading(false);
    }, []);

    // Handler functions for the dashboard
    const handleLike = (blogId) => setBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, likes: blog.likes.some(l => l.id === currentUser.id) ? blog.likes.filter(l => l.id !== currentUser.id) : [...blog.likes, { id: currentUser.id, name: currentUser.name }] } : blog));
    const handleComment = (blogId, text) => setBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, comments: [...blog.comments, { id: Date.now(), user: { id: currentUser.id, name: currentUser.name }, text }] } : blog));
    const handleDelete = (blogId) => { if (window.confirm('Delete this blog?')) setBlogs(blogs.filter(b => b.id !== blogId)); };
    const handleBlogSubmit = (blogData) => {
        if (blogData.id) { setBlogs(blogs.map(b => b.id === blogData.id ? { ...b, ...blogData } : b)); }
        else { setBlogs([{ ...blogData, id: Date.now(), author: currentUser, likes: [], comments: [], timestamp: new Date().toISOString() }, ...blogs]); }
        closeModal();
    };
    const handleProfileUpdate = (updatedProfile) => { setCurrentUser(prev => ({ ...prev, ...updatedProfile })); closeModal(); };
    const handleFollow = (userId) => {
        const isFollowing = currentUser.following.includes(userId);
        const updatedFollowing = isFollowing ? currentUser.following.filter(id => id !== userId) : [...currentUser.following, userId];
        setCurrentUser({ ...currentUser, following: updatedFollowing });
    };

    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => setModalContent({ type, data });
    
    // This function will navigate to a user's profile page
    const navigateToProfile = (user) => {
    console.log("Navigating to profile of:", user.name);
    navigate(`/profile/${user.id}`); // Example of future routing
    };

    if (loading || !currentUser) {
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-2xl font-bold text-white">Loading Dashboard...</div>;
    }

    return (
        <>
            <DashboardView
                blogs={blogs}
                currentUser={currentUser}
                allUsers={allUsers}
                visibleBlogs={visibleBlogs}
                setVisibleBlogs={setVisibleBlogs}
                handleLike={handleLike}
                handleComment={handleComment}
                handleDelete={handleDelete}
                openModal={openModal}
                navigateTo={navigateToProfile} // Using the new navigation function
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
                    />
                </Modal>
            )}
        </>
    );
}