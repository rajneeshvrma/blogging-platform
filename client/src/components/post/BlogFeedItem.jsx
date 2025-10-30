import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, CommentIcon } from '../common/Icons';

const BlogFeedItem = ({ post }) => {
    const navigate = useNavigate();

    const authorName = post.author?.name || 'Unknown Author';
    const postDate = post.createdAt || post.timestamp;

    const createSnippet = (content, length = 150) => {
        if (!content) return '';
        const text = content.replace(/<[^>]+>/g, '');
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    return (
        <div 
            onClick={() => navigate(`/post/${post._id}`)}
            className="
                w-full flex flex-col md:flex-row items-center gap-8 p-6 
                bg-glass backdrop-blur-lg border border-glass rounded-2xl 
                hover:bg-white/10 transition-all duration-300 cursor-pointer
                group transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10
            "
        >
            <div className="w-full md:w-1/3 h-56 flex-shrink-0">
                <img 
                    src={post.imageUrl || '/public/darkmode logo glassblog.png'} 
                    alt={post.title} 
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error'; }}
                />
            </div>

            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <img src={post.author?.avatar || 'https://placehold.net/avatar-4.svg'} alt={authorName} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-text-primary">{authorName}</p>
                            <p className="text-sm text-text-secondary">{new Date(postDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-indigo-400 transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-text-secondary mb-4">
                        {createSnippet(post.content)}
                    </p>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-text-secondary mt-auto">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="w-5 h-5" />
                        <span>{post.likes?.length || 0} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CommentIcon className="w-5 h-5" />
                        <span>{post.comments?.length || 0} Comments</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogFeedItem;