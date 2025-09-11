import React, { useState } from 'react';
import { HeartIcon, CommentIcon, ShareIcon, EditIcon, DeleteIcon } from '../common/Icons';

// FIXED: Replaced all hardcoded dark theme colors with theme variables.
const BlogPost = ({ blog, currentUser, onLike, onComment, onEdit, onDelete, onShare, onLikersClick, onProfileClick, index }) => {
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongContent = blog.content.length > 300;
    const displayContent = isLongContent && !isExpanded ? `${blog.content.substring(0, 300)}...` : blog.content;

    return (
        <div id={`blog-${blog.id}`} className="bg-glass backdrop-blur-xl border border-glass rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-indigo-500/30 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover" />}
            <div className="p-6 text-text-primary">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => onProfileClick(blog.author)} className="flex items-center group">
                        <img src={blog.author.avatar} alt={blog.author.name} className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-lg group-hover:text-indigo-400 transition">{blog.author.name}</p>
                            <p className="text-sm text-text-secondary">{new Date(blog.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                        </div>
                    </button>
                    {blog.author.id === currentUser.id && (
                        <div className="flex space-x-2">
                            <button onClick={() => onEdit(blog)} className="text-text-secondary hover:text-indigo-400"><EditIcon className="w-5 h-5" /></button>
                            <button onClick={() => onDelete(blog.id)} className="text-text-secondary hover:text-red-400"><DeleteIcon className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold mb-3">{blog.title}</h2>
                <p className="text-text-secondary mb-4 whitespace-pre-wrap">{displayContent}</p>
                {isLongContent && <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">{isExpanded ? 'Show Less' : 'Read More'}</button>}
                <div className="flex items-center space-x-4 text-sm text-text-secondary my-4">
                    <button onClick={onLikersClick} className="hover:underline">{blog.likes.length} Likes</button>
                    <button onClick={() => setShowComments(!showComments)} className="hover:underline">{blog.comments.length} Comments</button>
                </div>
                <div className="border-t border-b border-glass my-2 flex justify-around">
                    <button onClick={() => onLike(blog.id)} className={`flex-1 flex items-center justify-center p-3 space-x-2 hover:bg-accent/10 transition-colors rounded-lg ${blog.likes.some(l => l.id === currentUser.id) ? 'text-red-400' : 'text-text-secondary'}`}>
                        <HeartIcon className="w-6 h-6" solid={blog.likes.some(l => l.id === currentUser.id)} />
                        <span>Like</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center p-3 space-x-2 text-text-secondary hover:bg-accent/10 transition-colors rounded-lg">
                        <CommentIcon className="w-6 h-6" />
                        <span>Comment</span>
                    </button>
                    <button onClick={onShare} className="flex-1 flex items-center justify-center p-3 space-x-2 text-text-secondary hover:bg-accent/10 transition-colors rounded-lg">
                        <ShareIcon className="w-6 h-6" />
                        <span>Share</span>
                    </button>
                </div>
                {showComments && (
                    <div className="mt-4 space-y-3 animate-fade-in-down">
                        {blog.comments.map(comment => (
                            <div key={comment.id} className="text-sm p-2 rounded-lg bg-background/50">
                                <span className="font-bold text-text-primary">{comment.user.name}: </span>{comment.text}
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); onComment(blog.id, e.target.comment.value); e.target.comment.value = ''; }} className="flex items-center mt-2">
                    <img src={currentUser.avatar} alt="You" className="w-8 h-8 rounded-full mr-2" />
                    <input type="text" name="comment" placeholder="Write a comment..." className="w-full bg-background/50 dark:bg-white/10 rounded-full px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:ring-indigo-500 focus:border-indigo-500 border-transparent" />
                </form>
            </div>
        </div>
    );
};

export default BlogPost;