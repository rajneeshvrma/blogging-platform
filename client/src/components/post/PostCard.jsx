import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const authorName = post?.author?.name || 'Unknown Author';
    const postDate = post?.publishedAt || post?.createdAt || post?.timestamp;
    const postId = post?._id || post?.id;
    const imageUrl = post?.imageUrl || 'https://placehold.co/800x400/1B263B/E0E1DD?text=No+Image';

    const handleClick = () => {
        if (postId) {
            navigate(`/post/${postId}`);
        } else {
            console.error("Cannot navigate: Post ID is missing.", post);
        }
    };

    return (
        <div
            className="bg-glass backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-glass"
           onClick={handleClick}
        >
            <img
                className="w-full h-48 object-cover"
                src={imageUrl}
                alt={post?.title || 'Blog post image'}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error'; }} />
            <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">{post?.title || 'Untitled Post'}</h3>
                <p className="text-text-secondary text-sm">
                    By {authorName} on {postDate ? new Date(postDate).toLocaleDateString() : 'Unknown Date'}
                </p>
            </div>
        </div>
    );
};

export default PostCard;