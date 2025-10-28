import React, { useState } from 'react';
import { HeartIcon, CommentIcon, ShareIcon, EditIcon, DeleteIcon } from '../common/Icons';

const BlogPost = ({ blog, currentUser, onLike, onComment, onEdit, onDelete, onShare, onLikersClick, onProfileClick, index }) => {
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

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
    const authorAvatar = blog.author?.avatar || `https://i.pravatar.cc/150?u=${blog.author?._id || blog.author?.id || 'default'}`;
    const authorId = blog.author?._id || blog.author?.id || blog.author; 

    const handleProfileClick = () => {
        // *** ADD LOGGING HERE ***
        console.log("Profile clicked in BlogPost. Author object:", blog.author);
        if (blog.author && typeof onProfileClick === 'function') {
            onProfileClick(blog.author);
        } else {
            console.error("Cannot navigate to profile: Author data or onProfileClick function is missing.", { author: blog.author, onProfileClick });
        }
    };

    const blogIdForActions = blog._id || blog.id;

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
                            blog.comments.map(comment => (
                                <div key={comment.id || comment._id} className="text-sm p-2 rounded-lg bg-background/50">
                                    <span className="font-bold text-text-primary">{comment.user?.name || 'User'}: </span>{comment.text}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-text-secondary">No comments yet.</p>
                        )}
                    </div>
                )}
                <form onSubmit={handleCommentSubmit} className="flex items-center mt-2">
                    <img
                        src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUserId}`}
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
        </div>
    );
};

export default BlogPost;