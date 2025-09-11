import React, { useState, useEffect } from 'react';
import { postService } from '../api/postService';
import Spinner from '../components/common/Spinner';

const PostDetailsPage = ({ slug }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const fetchedPost = await postService.getPostBySlug(slug);
            setPost(fetchedPost);
            setLoading(false);
        };
        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }
    
    if (!post) {
        return <div className="text-center text-text-primary text-2xl mt-20">Post not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-glass backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-glass p-6 sm:p-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">{post.title}</h1>
                <div className="flex items-center text-text-secondary mb-6">
                    <span>By {post.author}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <img className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" src={post.imageUrl} alt={post.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error'; }} />
                <div className="prose prose-invert prose-lg max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
        </div>
    );
};

export default PostDetailsPage;