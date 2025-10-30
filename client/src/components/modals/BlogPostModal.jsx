import React from 'react';

const BlogPostModal = ({ blog, currentUser, onEdit }) => {
    return (
        <div className="max-h-[80vh] overflow-y-auto pr-2 text-white">
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-4" onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/800x400?text=Image+Error'; 
        }} />}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <img src={blog.author.avatar || 'https://placehold.net/avatar-4.svg'} alt={blog.author.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <p className="font-bold text-lg">{blog.author.name}</p>
                        <p className="text-sm text-white/60">{new Date(blog.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
                {blog.author.id === currentUser.id && (
                    <button onClick={() => onEdit(blog)} className="bg-white/20 text-white font-semibold py-2 px-4 rounded-full hover:bg-white/30 transition-colors">
                        Edit Post
                    </button>
                )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
            <p className="text-white/80 whitespace-pre-wrap">{blog.content}</p>
        </div>
    );
};

export default BlogPostModal;