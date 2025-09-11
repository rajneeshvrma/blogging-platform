import React from 'react';

const UserProfileHeader = ({ profile, currentUser, onFollow, onEditProfile, onFollowersClick, onFollowingClick }) => {
    const isFollowing = currentUser?.following?.includes(profile.id) ?? false;
    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="bg-glass backdrop-blur-xl border border-glass rounded-2xl shadow-lg overflow-hidden">
            <img src={profile.coverPhoto} alt="Cover" className="w-full h-48 object-cover" />
            <div className="p-6 relative">
                <div className="flex justify-between items-start">
                    <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full -mt-20 border-4 border-background shadow-md" />
                    {isOwnProfile ? (
                        <button onClick={() => onEditProfile(profile)} className="bg-white/20 dark:bg-black/20 text-text-primary font-semibold py-2 px-4 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors">Edit Profile</button>
                    ) : (
                        <button onClick={() => onFollow(profile.id)} className={`py-2 px-6 rounded-full font-semibold transition-colors ${isFollowing ? 'bg-white/20 dark:bg-black/20 text-text-primary' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
                <h3 className="text-3xl font-bold text-text-primary mt-4">{profile.name}</h3>
                <p className="text-text-secondary mt-2">{profile.bio}</p>
                <div className="flex items-center space-x-6 mt-4 text-sm text-text-primary">
                    <button onClick={onFollowersClick} className="hover:text-indigo-400">
                        <b>{profile.followers.length}</b><span className="text-text-secondary ml-1">Followers</span>
                    </button>
                    <button onClick={onFollowingClick} className="hover:text-indigo-400">
                        <b>{profile.following.length}</b><span className="text-text-secondary ml-1">Following</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeader;