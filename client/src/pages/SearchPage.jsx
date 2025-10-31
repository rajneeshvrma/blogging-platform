import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAuth';
import InfoPageLayout from './InfoPageLayout'; 
import BlogFeedItem from '../components/post/BlogFeedItem';
import { SearchIcon } from '../components/common/Icons';

const UserSearchResult = ({ user }) => (
    <Link 
        to={`/profile/${user._id || user.id}`} 
        className="flex items-center gap-4 p-4 bg-glass backdrop-blur-lg border border-glass rounded-2xl hover:bg-white/10 transition-all"
    >
        <img src={user.avatar || 'https://placehold.net/avatar-4.svg'} alt={user.name} className="w-12 h-12 rounded-full" />
        <div>
            <h3 className="font-bold text-text-primary">{user.name}</h3>
            <p className="text-sm text-text-secondary line-clamp-1">{user.bio || 'No bio available.'}</p>
        </div>
    </Link>
);

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const { posts, allUsers, isAuthenticated } = useAppContext(); 
    
    const query = searchParams.get('q');
    
    const [filter, setFilter] = useState('all'); 
    const [sortOrder, setSortOrder] = useState('newest');
    const [localQuery, setLocalQuery] = useState(query || ''); 

    useEffect(() => {
        setLocalQuery(query || '');
    }, [query]);

    const lowerCaseQuery = query ? query.toLowerCase() : '';

    const userResults = useMemo(() => {
        if (!isAuthenticated) {
            return [];
        }
        return allUsers.filter(user => {
            if (!user) return false;
            const id = (user._id || user.id || '').toLowerCase();
            return (
                user.name?.toLowerCase().includes(lowerCaseQuery) ||
                user.email?.toLowerCase().includes(lowerCaseQuery) || 
                id.includes(lowerCaseQuery) 
            );
        });
    }, [allUsers, lowerCaseQuery, isAuthenticated]);

    const postResultsRaw = useMemo(() => posts.filter(post => 
        (post.title?.toLowerCase().includes(lowerCaseQuery) || 
        post.content?.toLowerCase().includes(lowerCaseQuery)) &&
        post.status === 'published'
    ), [posts, lowerCaseQuery]);

    const postResults = useMemo(() => {
        return [...postResultsRaw].sort((a, b) => {
            if (sortOrder === 'oldest') {
                return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt);
            }
            if (sortOrder === 'most_liked') {
                return (b.likes?.length || 0) - (a.likes?.length || 0);
            }
            return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
        });
    }, [postResultsRaw, sortOrder]);

    const handleLocalSearch = (e) => {
        e.preventDefault();
        const newQuery = localQuery.trim();
        if (newQuery) {
            setSearchParams({ q: newQuery }); 
        } else {
            setSearchParams({});
        }
    };
    
    const getButtonClass = (type) => {
        return `px-6 py-2 rounded-full font-semibold transition-colors ${
            filter === type 
            ? 'bg-indigo-500 text-white' 
            : 'bg-glass text-text-primary hover:bg-white/20'
        }`;
    };

    return (
        <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
                    Search Results {query && `for "${query}"`}
                </h1>
                
                <form onSubmit={handleLocalSearch} className="w-full md:w-auto md:max-w-sm relative">
                    <input
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Search again..."
                        className="w-full bg-glass text-text-primary placeholder-text-secondary rounded-full py-3 pl-6 pr-16 border border-glass focus:border-indigo-500 outline-none"
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 px-6 text-text-secondary hover:text-indigo-400" aria-label="Search">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <div className="bg-glass backdrop-blur-md rounded-xl shadow-lg border border-glass p-6 sm:p-10">
                
                <div className="flex justify-center gap-4 mb-12">
                    <button onClick={() => setFilter('all')} className={getButtonClass('all')}>
                        All ({postResults.length + userResults.length})
                    </button>
                    <button onClick={() => setFilter('posts')} className={getButtonClass('posts')}>
                        Posts ({postResults.length})
                    </button>
                    <button onClick={() => setFilter('users')} className={getButtonClass('users')}>
                        Users ({userResults.length})
                    </button>
                </div>

                {(filter === 'all' || filter === 'posts') && postResults.length > 0 && (
                    <div className="flex justify-end mb-6 max-w-4xl mx-auto">
                        <label htmlFor="sort-blogs" className="text-sm text-text-secondary mr-2 self-center">Sort by:</label>
                        <select
                            id="sort-blogs"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-glass border border-glass rounded-full text-text-primary px-4 py-2 outline-none focus:border-indigo-500 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most_liked">Most Liked</option>
                        </select>
                    </div>
                )}

                <div className="max-w-4xl mx-auto space-y-12">
                    {(filter === 'all' || filter === 'users') && (
                        <section>
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Users</h2>
                            {!isAuthenticated ? (
                                <p className="text-text-secondary text-center p-4 bg-black/20 rounded-lg border border-glass">
                                    Please <Link to="/auth" state={{ show: 'login' }} className="text-indigo-400 underline font-semibold">log in</Link> to search for users.
                                </p>
                            ) : userResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userResults.map(user => <UserSearchResult key={user._id || user.id} user={user} />)}
                                </div>
                            ) : (
                                <p className="text-text-secondary">No users found matching your search.</p>
                            )}
                        </section>
                    )}

                    {(filter === 'all' || filter === 'posts') && (
                        <section>
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Posts</h2>
                            {postResults.length > 0 ? (
                                <div className="flex flex-col gap-8">
                                    {postResults.map(post => <BlogFeedItem key={post._id || post.id} post={post} />)}
                                </div>
                            ) : (
                                <p className="text-text-secondary">No posts found matching your search.</p>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;