import React, { useState, useEffect } from 'react';
import { generateDummyBlogs, ALL_USERS } from '../data/dummyData';
import DashboardView from './DashboardView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAuth';

export default function DashboardPage() {
    const [blogs, setBlogs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalContent, setModalContent] = useState(null);
    const [visibleBlogs, setVisibleBlogs] = useState(5);
    
    const navigate = useNavigate();
    const { user: currentUser, setUser: setCurrentUser } = useAppContext();

    useEffect(() => {
        setBlogs(generateDummyBlogs(50));
        setAllUsers(ALL_USERS);
        setLoading(false);
    }, []);

    const handleLike = (blogId) => {
        setBlogs(blogs.map(blog => 
            blog.id === blogId 
                ? { ...blog, likes: blog.likes.some(l => l.id === currentUser.id) 
                    ? blog.likes.filter(l => l.id !== currentUser.id) 
                    : [...blog.likes, { id: currentUser.id, name: currentUser.name }] }
                : blog
        ));
    };
    
    const handleComment = (blogId, text) => {
        if (!text.trim()) return;
        const newComment = { id: Date.now(), user: { id: currentUser.id, name: currentUser.name }, text };
        setBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, comments: [...blog.comments, newComment] } : blog));
    };

    const handleDelete = (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            setBlogs(blogs.filter(b => b.id !== blogId));
        }
    };

    const handleBlogSubmit = (blogData) => {
        if (blogData.id) {
            setBlogs(blogs.map(b => b.id === blogData.id ? { ...b, ...blogData, author: currentUser } : b));
        } else {
            const newBlog = { ...blogData, id: Date.now(), author: currentUser, likes: [], comments: [], timestamp: new Date().toISOString() };
            setBlogs([newBlog, ...blogs]);
        }
        closeModal();
    };

    const handleProfileUpdate = (updatedProfile) => {
        setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
        closeModal();
    };
    
    const handleFollow = (userId) => {
        const isFollowing = currentUser.following.includes(userId);
        const updatedFollowing = isFollowing 
            ? currentUser.following.filter(id => id !== userId) 
            : [...currentUser.following, userId];
        setCurrentUser({ ...currentUser, following: updatedFollowing });
    };

    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => setModalContent({ type, data });
    
    const navigateToProfile = (user) => {
        closeModal();
        navigate(`/profile/${user.id}`);
    };

    if (loading || !currentUser) {
        return <div className="pt-24 text-center">Loading...</div>;
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
                    />
                </Modal>
            )}
        </>
    );
}