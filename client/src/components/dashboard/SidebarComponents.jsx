import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, NewPostIcon, TrendingIcon } from '../common/Icons';

export const SearchCard = ({ onSearch }) => {
     const [query, setQuery] = useState('');
     const handleSubmit = (e) => {
         e.preventDefault();
         if (query.trim()) {
             onSearch(query);
         }
     }
     return (
         <div className="bg-glass backdrop-blur-xl border border-glass p-6 rounded-2xl shadow-lg text-text-primary animate-fade-in">
             <h3 className="text-xl font-bold mb-4">Search</h3>
             <form onSubmit={handleSubmit} className="relative">
                 <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Search users or blogs..."
                     className="w-full bg-background/50 dark:bg-white/10 text-text-primary placeholder-text-secondary rounded-full py-2 pl-4 pr-10 focus:border-indigo-500 focus:bg-background/70 outline-none transition" />
                 <button type="submit" className="absolute inset-y-0 right-0 px-3 text-text-secondary hover:text-text-primary"><SearchIcon className="w-5 h-5" /></button>
             </form>
         </div>
     );
};

export const NewPostCard = ({ onNewPostClick }) => (
     <div className="bg-glass backdrop-blur-xl border border-glass p-6 rounded-2xl shadow-lg text-text-primary animate-fade-in">
         <h3 className="text-xl font-bold mb-4">Create New Blog</h3>
         <p className="text-sm text-text-secondary mb-4">Share your new idea with the world.</p>
         <button onClick={onNewPostClick} className="w-full flex items-center justify-center bg-indigo-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-600 transition-colors">
             <NewPostIcon className="w-5 h-5 mr-2" />Create Post
         </button>
     </div>
);

export const TrendingCard = () => (
    <div className="bg-glass backdrop-blur-xl border border-glass p-6 rounded-2xl shadow-lg text-text-primary animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center"><TrendingIcon className="w-6 h-6 mr-2" /> Trending Topics</h3>
        <ul className="space-y-3">
            {['#MERN', '#ReactJS', '#Glassmorphism', '#WebDev', '#UIUX'].map(tag =>
                <li key={tag} className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">{tag}</li>
            )}
        </ul>
    </div>
);

export const SuggestionsCard = ({ blogs = [], currentUser, navigateTo }) => {
     const navigate = useNavigate(); 

     const suggestions = useMemo(() => {
         return blogs
             .filter(blog => blog.author && blog.author.id !== currentUser?.id && blog.author._id !== currentUser?._id)
             .sort(() => 0.5 - Math.random()) 
             .slice(0, 4);
     }, [blogs, currentUser]); 

     if (!currentUser || suggestions.length === 0) return null;

     const handleSuggestionClick = (blog) => {
         
         navigate(`/post/${blog.id || blog._id}`);
     };

    return (
        <div className="bg-glass backdrop-blur-xl border border-glass p-6 rounded-2xl shadow-lg text-text-primary animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Suggested for You</h3>
            <ul className="space-y-4">
                {suggestions.map(blog => (
                     blog && blog.author && (
                        <li key={blog.id || blog._id}>
                            <button onClick={() => handleSuggestionClick(blog)} className="w-full text-left group">
                                <p className="font-semibold group-hover:text-indigo-400 transition truncate">{blog.title}</p>
                                <p className="text-xs text-text-secondary">by {blog.author.name}</p>
                            </button>
                         </li>
                    )
                ))}
            </ul>
        </div>
    );
};