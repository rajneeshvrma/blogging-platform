import React, { useState } from 'react';
import DashboardView from './DashboardView';
import Modal from '../components/common/Modal';
import ModalContent from '../components/modals/ModalContent';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAuth';
import { ALL_USERS } from '../data/dummyData';

export default function DashboardPage() {
    const [modalContent, setModalContent] = useState(null);
    const [visibleBlogs, setVisibleBlogs] = useState(5);
    
    const navigate = useNavigate();
    const { user: currentUser, setUser: setCurrentUser, posts, addPost, deletePost } = useAppContext();

    const feedPosts = posts
        .filter(post => post.status === 'published' || !post.status) 
        .sort((a, b) => new Date(b.publishedAt || b.timestamp) - new Date(a.publishedAt || a.timestamp)); 

    const handleLike = (blogId) => {
        console.log("Liked blog:", blogId);
    };
    
    const handleComment = (blogId, text) => {
        console.log("Commented on blog:", blogId, "with text:", text);
    };

    const handleDelete = (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            deletePost(blogId); 
        }
    };
    const handleBlogSubmit = (blogData) => {
        addPost(blogData); 
        closeModal();
    };
    const handleProfileUpdate = (updatedProfile) => {
        setCurrentUser(updatedProfile);
        closeModal();
    };

    const handleFollow = (userId) => { /* Dummy function */ };
    const closeModal = () => setModalContent(null);
    const openModal = (type, data) => setModalContent({ type, data });
    
    const navigateToProfile = (user) => {
        closeModal();
        navigate(`/profile/${user.id}`); 
    };

    if (!currentUser) {
        return <div className="pt-24 text-center">Loading user...</div>;
    }

    return (
        <>
            <DashboardView
                blogs={feedPosts} 
                currentUser={currentUser}
                allUsers={ALL_USERS} 
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
                        allUsers={ALL_USERS} 
                        openModal={openModal}
                    />
                </Modal>
            )}
        </>
    );
}