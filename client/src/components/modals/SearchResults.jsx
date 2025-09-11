import React from 'react';

const SearchResults = ({ data, onProfileClick, onClose }) => {
    const { query, allUsers, blogs } = data;
    const userResults = allUsers.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    const blogResults = blogs.filter(blog => blog.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h4 className="font-bold mb-2">Users</h4>
                {userResults.length > 0 ? userResults.map(user => (
                    <button key={user.id} onClick={() => { onProfileClick(user); onClose(); }} className="w-full text-left flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <img src={user.avatar} className="w-8 h-8 rounded-full mr-3" alt={user.name}/>
                        <span>{user.name}</span>
                    </button>
                )) : <p className="text-sm text-white/60">No users found.</p>}
            </div>
            <div>
                <h4 className="font-bold mb-2">Blogs</h4>
                {blogResults.length > 0 ? blogResults.map(blog => (
                    <a key={blog.id} href={`#blog-${blog.id}`} onClick={onClose} className="block p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="font-semibold">{blog.title}</span>
                        <span className="text-xs text-white/60 block"> by {blog.author.name}</span>
                    </a>
                )) : <p className="text-sm text-white/60">No blogs found.</p>}
            </div>
        </div>
    );
};

export default SearchResults;