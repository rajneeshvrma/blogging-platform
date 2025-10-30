import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAuth';
import BlogFeedItem from '../components/post/BlogFeedItem';

const ExploreBlogsPage = () => {
    const { posts } = useAppContext();
    const [visiblePosts, setVisiblePosts] = useState(5);

    const loadMorePosts = () => {
        setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 5);
    };

    const exploreBgUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba';

    return (
        <div className="relative min-h-screen isolate">
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center opacity-15"
                style={{ backgroundImage: `url(${exploreBgUrl})` }}
                aria-hidden="true"
            />
            <div className="relative z-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-4 tracking-tight">
                            Explore All Stories
                        </h1>
                        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                            Discover stories, thinking, and expertise from writers on any topic.
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto flex flex-col gap-12">
                        {posts.slice(0, visiblePosts).map(post => (
                            <BlogFeedItem key={post._id || post.id} post={post} />
                        ))}
                    </div>

                    {visiblePosts < posts.length && (
                        <div className="text-center mt-16">
                            <button
                                onClick={loadMorePosts}
                                className="
                                    bg-indigo-500 text-white font-semibold py-3 px-8 rounded-full 
                                    hover:bg-indigo-600 transition-all duration-300 
                                    transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50
                                "
                            >
                                Load More Stories
                            </button>
                        </div>
                    )}
                </div>                
            </div>
        </div>
    );
};

export default ExploreBlogsPage;