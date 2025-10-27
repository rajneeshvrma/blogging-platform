import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    
    // author object से author का नाम निकालें
    const authorName = post.author?.name || 'Unknown Author';
    const postDate = post.createdAt || post.timestamp;
    console.log("PostCard → post:", post);


    return (
        <div 
            className="bg-glass backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-glass"
           onClick={() => navigate(`/post/${post._id}`)}
        >
            <img className="w-full h-48 object-cover" src={post.imageUrl} alt={post.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error'; }} />
            <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">{post.title}</h3>
                {/* यहाँ post.author.name का उपयोग करें */}
                <p className="text-text-secondary text-sm">By {authorName} on {new Date(postDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default PostCard;