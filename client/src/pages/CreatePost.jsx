import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAppContext } from '../hooks/useAuth';
import { postService } from '../api/postService';
import Button from '../components/common/Button';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAppContext();
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newPost = await postService.createPost({
                title, 
                content: `<p>${content.replace(/\n/g, '</p><p>')}</p>`, 
                author: user.name, 
                authorId: user.id,
                slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                featured: false,
            });
            navigate(`/post/${newPost.slug}`); // Navigate after creating post
        } catch (err) {
            console.error("Failed to create post", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // The rest of the component remains the same
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-glass backdrop-blur-md rounded-xl shadow-lg border border-glass p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-text-primary mb-6">Create a New Post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form inputs */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title</label>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-glass ..."/>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Content</label>
                        <textarea name="content" id="content" rows="10" value={content} onChange={(e) => setContent(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-glass ..."></textarea>
                    </div>
                    <div><Button type="submit" isLoading={isLoading}>Publish Post</Button></div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;