import React, { useState } from 'react';
import { HeartIcon, CommentIcon, ShareIcon, EditIcon, DeleteIcon, TrashIcon } from '../common/Icons';
import Spinner from '../common/Spinner';
import ConfirmationModal from '../common/ConfirmationModal';

const BlogPost = ({ blog, currentUser, onLike, onComment, onEdit, onDelete, onShare, onLikersClick, onProfileClick, index, onUpdateComment, onDeleteComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null); 

    if (!blog || !currentUser) {
        console.warn("BlogPost rendered without blog or currentUser:", { blog, currentUser });
        return null;
    }

    const isLongContent = blog.content && typeof blog.content === 'string' && blog.content.length > 300;
    const displayContent = isLongContent && !isExpanded ? `${blog.content.substring(0, 300)}...` : (blog.content || '');

    const currentUserId = currentUser._id || currentUser.id;
    const isLiked = Array.isArray(blog.likes) && blog.likes.some(like =>
        (typeof like === 'string' && like === currentUserId) ||
        (typeof like === 'object' && (like._id === currentUserId || like.id === currentUserId))
    );

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            const blogId = blog.id || blog._id;
            if (blogId) {
                onComment(blogId, commentText);
                setCommentText('');
            } else {
                console.error("Cannot submit comment: Blog ID or onComment function is missing.", { blogId, onComment });
            }
        }
    };

    const authorName = blog.author?.name || 'Unknown Author';
    const authorAvatar = blog.author?.avatar || `https://placehold.net/avatar-4.svg`;
    const authorId = blog.author?._id || blog.author?.id || blog.author;

    const handleProfileClick = () => {
        console.log("Profile clicked in BlogPost. Author object:", blog.author);
        if (blog.author && typeof onProfileClick === 'function') {
            onProfileClick(blog.author);
        } else {
            console.error("Cannot navigate to profile: Author data or onProfileClick function is missing.", { author: blog.author, onProfileClick });
        }
    };

    const handleDeleteClick = (comment) => {
        setCommentToDelete(comment); 
        setConfirmDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (commentToDelete && blogIdForActions) {
            const commentId = commentToDelete.id || commentToDelete._id;
            await onDeleteComment(commentId, blogIdForActions); 
        }
        setConfirmDeleteModalOpen(false); 
        setCommentToDelete(null);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const blogIdForActions = blog._id || blog.id;

    const startEditing = (comment) => {
        setEditingCommentId(comment.id || comment._id);
        setEditingCommentText(comment.text);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const saveEdit = async () => {
        if (!editingCommentText.trim() || !editingCommentId || !blogIdForActions) return;
        setIsSavingEdit(true);
        try {
            await onUpdateComment(editingCommentId, blogIdForActions, editingCommentText);
            cancelEditing(); 
        } catch (error) {
            console.error("Error saving comment edit:", error);
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <div id={`blog-${blogIdForActions}`} key={blogIdForActions || `blog-${index}`} className="bg-glass backdrop-blur-xl border border-glass rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-indigo-500/30 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title || 'Blog Image'} className="w-full h-64 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400?text=Image+Error'; }} />}
            <div className="p-6 text-text-primary">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center group"
                        disabled={!blog.author}
                    >
                        <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-lg group-hover:text-indigo-400 transition">{authorName}</p>
                            <p className="text-sm text-text-secondary">
                                {blog.publishedAt || blog.createdAt || blog.timestamp
                                    ? new Date(blog.publishedAt || blog.createdAt || blog.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
                                    : 'Date unknown'}
                            </p>
                        </div>
                    </button>
                    {authorId === currentUserId && blogIdForActions && (
                        <div className="flex space-x-2">
                            <button onClick={() => typeof onEdit === 'function' && onEdit(blog)} className="text-text-secondary hover:text-indigo-400"><EditIcon className="w-5 h-5" /></button>
                            <button onClick={() => typeof onDelete === 'function' && onDelete(blogIdForActions)} className="text-text-secondary hover:text-red-400"><DeleteIcon className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold mb-3">{blog.title || 'Untitled Post'}</h2>
                <p className="text-text-secondary mb-4 whitespace-pre-wrap">{displayContent}</p>
                {isLongContent && <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">{isExpanded ? 'Show Less' : 'Read More'}</button>}
                <div className="flex items-center space-x-4 text-sm text-text-secondary my-4">
                    <button
                        onClick={() => Array.isArray(blog.likes) && blog.likes.length > 0 && typeof onLikersClick === 'function' && onLikersClick(blog.likes)}
                        className="hover:underline"
                        disabled={!Array.isArray(blog.likes) || blog.likes.length === 0}
                    >
                        {blog.likes?.length || 0} Likes
                    </button>
                    <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                        {blog.comments?.length || 0} Comments
                    </button>
                </div>
                <div className="border-t border-b border-glass my-2 flex justify-around">
                    <button
                        onClick={() => blogIdForActions && typeof onLike === 'function' && onLike(blogIdForActions)}
                        className={`flex-1 flex items-center justify-center p-3 space-x-2 hover:bg-accent/10 transition-colors rounded-lg ${isLiked ? 'text-red-400' : 'text-text-secondary'}`}
                        disabled={!blogIdForActions}
                    >
                        <HeartIcon className="w-6 h-6" solid={isLiked} />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center p-3 space-x-2 text-text-secondary hover:bg-accent/10 transition-colors rounded-lg">
                        <CommentIcon className="w-6 h-6" />
                        <span>Comment</span>
                    </button>
                    <button
                        onClick={() => typeof onShare === 'function' && onShare(blog)}
                        className="flex-1 flex items-center justify-center p-3 space-x-2 text-text-secondary hover:bg-accent/10 transition-colors rounded-lg"
                    >
                        <ShareIcon className="w-6 h-6" />
                        <span>Share</span>
                    </button>
                </div>
                {showComments && (
                    <div className="mt-4 space-y-3 animate-fade-in-down">
                        {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
                            blog.comments.map(comment => {
                                const isEditingThis = (comment.id || comment._id) === editingCommentId;
                                const isOwnComment = comment.user?.id === currentUserId || comment.user?._id === currentUserId;

                                return (
                                    <div key={comment.id || comment._id} className="text-sm p-3 rounded-lg bg-background/50 group relative">
                                        {isEditingThis ? (
                                            // --- Editing View ---
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editingCommentText}
                                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                                    className="w-full bg-white/10 p-2 rounded border border-glass focus:border-indigo-500 outline-none text-text-primary"
                                                    rows="3"
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="px-3 py-1 text-xs rounded bg-white/20 hover:bg-white/30 text-text-secondary"
                                                        disabled={isSavingEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={saveEdit}
                                                        className="px-3 py-1 text-xs rounded bg-indigo-500 hover:bg-indigo-600 text-white flex items-center"
                                                        disabled={isSavingEdit}
                                                    >
                                                        {isSavingEdit ? <Spinner small /> : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <span className="font-bold text-text-primary">{comment.user?.name || 'User'}: </span>
                                                    <span className="text-text-primary whitespace-pre-wrap">{comment.text}</span>
                                                </div>
                                                {isOwnComment && (
                                                    <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => startEditing(comment)}
                                                            className="p-1 rounded bg-blue-600/50 hover:bg-blue-600/80 text-white"
                                                            aria-label="Edit comment"
                                                        >
                                                            <EditIcon className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(comment)}
                                                            className="p-1 rounded bg-red-600/50 hover:bg-red-600/80 text-white"
                                                            aria-label="Delete comment"
                                                        >
                                                            <TrashIcon className="w-3 h-3" /> 
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-text-secondary">No comments yet.</p>
                        )}
                    </div>
                )}
                <form onSubmit={handleCommentSubmit} className="flex items-center mt-2">
                    <img
                        src={currentUser.avatar || `https://placehold.net/avatar-4.svg`}
                        alt="You"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <input
                        type="text"
                        name="comment"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-background/50 dark:bg-white/10 rounded-full px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:ring-indigo-500 focus:border-indigo-500 border-transparent"
                    />
                </form>
            </div>
            <ConfirmationModal
                isOpen={confirmDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Comment Deletion"
                message="Are you sure you want to delete this comment?"
                confirmText="Delete"
            />
        </div>
    );
};

export default BlogPost;