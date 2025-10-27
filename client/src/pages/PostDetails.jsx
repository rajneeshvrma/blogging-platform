import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useAppContext } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const PostDetailsPage = () => {
    const { slug } = useParams(); 
    const { posts } = useAppContext(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const foundPost = posts.find(p => p.slug === slug);
        setPost(foundPost);
        setLoading(false);
    }, [slug, posts]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }
    
    if (!post) {
        return <div className="text-center text-text-primary text-2xl mt-20">Post not found.</div>;
    }
    
    const authorName = post.author?.name || 'Unknown Author';
    const postDate = post.createdAt || post.timestamp;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="bg-glass backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-glass p-6 sm:p-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">{post.title}</h1>
                <div className="flex items-center text-text-secondary mb-6">
                    <span>By {authorName}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{new Date(postDate).toLocaleDateString()}</span>
                </div>
                <img className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" src={post.imageUrl} alt={post.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error'; }} />
                <div className="prose prose-invert prose-lg max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
        </div>
    );
};

export default PostDetailsPage;