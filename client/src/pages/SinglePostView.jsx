import React from 'react';
import BlogPost from '../components/post/BlogPost';
import ProfileCard from '../components/profile/ProfileCard';
import { NewPostCard, SearchCard, TrendingCard, SuggestionsCard } from '../components/dashboard/SidebarComponents';

const SinglePostView = ({ blog, blogs, currentUser, allUsers, handleLike, handleComment, handleDelete, openModal, navigateTo, onFollow }) => (
    <main className="container mx-auto p-4 md:px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <NewPostCard onNewPostClick={() => openModal('createPost')} />
                    <SearchCard onSearch={(query) => openModal('search', { query, allUsers, blogs: [blog] })} />
                    <TrendingCard />
                </div>
            </aside>
            <div className="lg:col-span-2 space-y-8">
                <BlogPost blog={blog} currentUser={currentUser} onLike={handleLike} onComment={handleComment} onEdit={(b) => openModal('createPost', b)} onDelete={handleDelete} onShare={() => openModal('share', blog)} onLikersClick={() => openModal('likers', blog.likes)} onProfileClick={(author) => navigateTo('profile', author)} index={0} />
            </div>
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <ProfileCard user={currentUser} onProfileClick={() => navigateTo('profile', currentUser)} onFollowersClick={() => openModal('followers', { title: 'Followers', list: currentUser.followers, allUsers })} onFollowingClick={() => openModal('following', { title: 'Following', list: currentUser.following, allUsers })} />
                    <SuggestionsCard blogs={blogs.filter(b => b.id !== blog.id)} currentUser={currentUser} navigateTo={navigateTo} />
                </div>
            </aside>
        </div>
    </main>
);

export default SinglePostView;