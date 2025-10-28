import React from 'react';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import BlogPostModal from '../components/modals/BlogPostModal';
import Modal from '../components/common/Modal';
import { TrashIcon, EditIcon } from '../components/common/Icons';

const UserProfileView = ({ profile, blogs = [], currentUser, onFollow, allUsers = [], openModal, onDeletePost, postError, isFollowingProcessing }) => {
    const [postModal, setPostModal] = React.useState(null);

    const closePostModal = () => setPostModal(null);
    const openPostModal = (blog) => setPostModal(blog);

    const isOwnProfile = currentUser?._id && profile?._id && currentUser._id === profile._id;

    if (!profile) {
       console.warn("UserProfileView rendered without profile data.");
       return null;
    }

    return (
        <>
            <main className="container mx-auto p-4 md:px-6 pt-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <UserProfileHeader
                        profile={profile}
                        currentUser={currentUser}
                        onFollow={onFollow}
                        onEditProfile={() => openModal('editProfile', profile)}
                        onFollowersClick={() => openModal('followers', { title: 'Followers', list: profile.followers || [], allUsers })}
                        onFollowingClick={() => openModal('following', { title: 'Following', list: profile.following || [], allUsers })}
                        isFollowingProcessing={isFollowingProcessing}
                    />

                    {isOwnProfile && (
                        <div className="text-center">
                            <button
                                onClick={() => openModal('createPost')}
                                className="bg-indigo-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-600 transition-colors"
                            >
                                Create New Post
                            </button>
                        </div>
                    )}

                    {postError && <div className="text-center text-red-500 py-4">{postError}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(blogs) && blogs.map((blog, index) => (
                            <div
                                key={blog._id || `blog-${index}`}
                                className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden group animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div onClick={() => openPostModal(blog)} className="cursor-pointer">
                                    <img
                                        src={blog.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                                        alt={blog.title || 'Blog post image'}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400?text=Image+Error'; }}
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold text-white truncate text-lg">{blog.title || 'Untitled Post'}</h3>
                                    </div>
                                     {isOwnProfile && blog.status === 'draft' && (
                                        <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-0.5 rounded z-10">Draft</span>
                                     )}
                                     {isOwnProfile && blog.status === 'scheduled' && new Date(blog.publishedAt) > new Date() && (
                                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded z-10">Scheduled</span>
                                     )}
                                </div>
                                {isOwnProfile && (
                                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                             onClick={(e) => { e.stopPropagation(); openModal('createPost', blog); }}
                                             className="p-1.5 bg-blue-600/70 rounded-full text-white hover:bg-blue-700 transition"
                                             aria-label="Edit Post"
                                         >
                                             <EditIcon className="w-4 h-4" />
                                         </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeletePost(blog._id); }}
                                            className="p-1.5 bg-red-600/70 rounded-full text-white hover:bg-red-700 transition"
                                            aria-label="Delete Post"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                     {Array.isArray(blogs) && blogs.length === 0 && !postError && (
                         <div className="text-center text-gray-400 py-16">
                            <p className="text-lg">
                                {isOwnProfile ? "You haven't created any posts yet." : "This user hasn't published any posts yet."}
                            </p>
                         </div>
                     )}
                </div>
            </main>

            {postModal && (
                 <Modal onClose={closePostModal} title={postModal.title || 'Blog Post'} size="2xl">
                    <BlogPostModal
                        blog={postModal}
                        currentUser={currentUser}
                        onEdit={(blogToEdit) => { closePostModal(); openModal('createPost', blogToEdit); }}
                    />
                 </Modal>
            )}
        </>
    );
};

export default UserProfileView;