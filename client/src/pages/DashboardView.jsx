import React from 'react';
import BlogPost from '../components/post/BlogPost';
import ProfileCard from '../components/profile/ProfileCard';
import { NewPostCard, SearchCard, TrendingCard, SuggestionsCard } from '../components/dashboard/SidebarComponents';

const DashboardView = ({ blogs, currentUser, allUsers, visibleBlogs, setVisibleBlogs, handleLike, handleComment, handleDelete, openModal, navigateTo, onFollow }) => (
    <main className="container mx-auto p-4 md:px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <NewPostCard onNewPostClick={() => openModal('createPost')} />
                    <SearchCard onSearch={(query) => openModal('search', { query, allUsers, blogs })} />
                    <TrendingCard />
                </div>
            </aside>
            <div className="lg:col-span-2 space-y-8">
                {blogs.slice(0, visibleBlogs).map((blog, index) => (
                    <BlogPost
                        key={blog.id}
                        blog={blog}
                        currentUser={currentUser}
                        onLike={handleLike}
                        onComment={handleComment}
                        onEdit={(b) => openModal('createPost', b)}
                        onDelete={handleDelete}
                        onShare={() => openModal('share', blog)}
                        onLikersClick={() => openModal('likers', blog.likes)}
                        onProfileClick={navigateTo}
                        index={index}
                    />
                ))}
                {visibleBlogs < blogs.length && (
                    <div className="text-center">
                        <button onClick={() => setVisibleBlogs(p => p + 5)} className="bg-white/20 backdrop-blur-lg border border-white/30 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white/30 transition-all">
                            Load More Blogs
                        </button>
                    </div>
                )}
            </div>
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <ProfileCard
                        user={currentUser}
                        onProfileClick={() => navigateTo(currentUser)}
                        onFollowersClick={() => openModal('followers', { title: 'Followers', list: currentUser.followers, allUsers })}
                        onFollowingClick={() => openModal('following', { title: 'Following', list: currentUser.following, allUsers })}
                    />
                    <SuggestionsCard blogs={blogs} currentUser={currentUser} navigateTo={navigateTo} />
                </div>
            </aside>
        </div>
    </main>
);

export default DashboardView;