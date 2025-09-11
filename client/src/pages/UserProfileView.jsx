import React from 'react';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import BlogPostModal from '../components/modals/BlogPostModal';
import Modal from '../components/common/Modal';

// This is the final version of your UserProfileView.
// It now correctly handles all UI and actions.
const UserProfileView = ({ profile, blogs, currentUser, onFollow, allUsers, openModal }) => {
    const [postModal, setPostModal] = React.useState(null);

    const closePostModal = () => setPostModal(null);
    const openPostModal = (blog) => setPostModal(blog);

    return (
        <>
            <main className="container mx-auto p-4 md:px-6 pt-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <UserProfileHeader
                        profile={profile}
                        currentUser={currentUser}
                        onFollow={onFollow}
                        // This now correctly opens the modal for editing the profile
                        onEditProfile={() => openModal('editProfile', profile)}
                        onFollowersClick={() => openModal('followers', { title: 'Followers', list: profile.followers, allUsers })}
                        onFollowingClick={() => openModal('following', { title: 'Following', list: profile.following, allUsers })}
                    />

                    {/* RESTORED: "Create New Post" button for your own profile */}
                    {currentUser?.id === profile.id && (
                        <div className="text-center">
                            <button 
                                onClick={() => openModal('createPost')} 
                                className="bg-indigo-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-600 transition-colors"
                            >
                                Create New Post
                            </button>
                        </div>
                    )}

                    {/* Grid of the user's blog posts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {blogs.map((blog, index) => (
                            <div key={blog.id} className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                {/* This button now opens the post in a modal */}
                                <button onClick={() => openPostModal(blog)} className="w-full text-left">
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <h3 className="p-4 font-bold text-white truncate">{blog.title}</h3>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modal for viewing a single post */}
            {postModal && (
                 <Modal onClose={closePostModal} title={postModal.title} size="2xl">
                    <BlogPostModal 
                        blog={postModal} 
                        currentUser={currentUser} 
                        // This onEdit function now correctly closes the view modal and opens the edit modal
                        onEdit={(blogToEdit) => {
                            closePostModal();
                            openModal('createPost', blogToEdit);
                        }}
                    />
                 </Modal>
            )}
        </>
    );
};

export default UserProfileView;