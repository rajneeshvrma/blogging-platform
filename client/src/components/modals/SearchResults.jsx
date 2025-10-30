import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ data, onProfileClick, onClose }) => {
    const navigate = useNavigate();
    const { query, allUsers = [], blogs = [] } = data;

    const lowerCaseQuery = query?.toLowerCase() || '';

    const userResults = allUsers.filter(user =>
        user.name?.toLowerCase().includes(lowerCaseQuery)
    );

    const blogResults = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(lowerCaseQuery)
    );

    const handleBlogClick = (blogId) => {
        onClose(); 
        navigate(`/post/${blogId}`); 
    };


    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h4 className="font-bold mb-2 text-text-primary">Users</h4>
                {userResults.length > 0 ? userResults.map(user => (
                    user && user.id && user.name && (
                         <button
                             key={user.id}
                             onClick={() => { onProfileClick(user); onClose(); }}
                             className="w-full text-left flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors text-text-primary"
                         >
                             <img
                                src={user.avatar || `https://placehold.net/avatar-4.svg`} 
                                className="w-8 h-8 rounded-full mr-3"
                                alt={user.name}
                             />
                             <span>{user.name}</span>
                         </button>
                    )
                )) : <p className="text-sm text-text-secondary">No users found matching "{query}".</p>}
            </div>
            <div>
                <h4 className="font-bold mb-2 text-text-primary">Blogs</h4>
                {blogResults.length > 0 ? blogResults.map(blog => (
                     blog && blog.id && blog.title && blog.author && (
                         <button
                             key={blog.id}
                             onClick={() => handleBlogClick(blog.id)}
                             className="block w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors"
                         >
                             <span className="font-semibold text-text-primary">{blog.title}</span>
                             <span className="text-xs text-text-secondary block"> by {blog.author.name || 'Unknown Author'}</span>
                         </button>
                     )
                )) : <p className="text-sm text-text-secondary">No blogs found matching "{query}".</p>}
            </div>
        </div>
    );
};

export default SearchResults;