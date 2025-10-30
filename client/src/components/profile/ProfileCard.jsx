import React from 'react';

const ProfileCard = ({ user, onProfileClick, onFollowersClick, onFollowingClick }) => {
    const followersCount = user?.followers?.length || 0;
    const followingCount = user?.following?.length || 0;

    const avatarUrl = user?.avatar
        ? user.avatar
        : `https://placehold.net/avatar-4.svg`;

    const coverPhotoUrl = user?.coverPhoto
        ? user.coverPhoto
        : `https://placehold.net/7-600x800.png`; 

    return (
        <div className="bg-glass backdrop-blur-xl border border-glass rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/30 animate-fade-in">
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-32 object-cover" />
            <div className="p-6 relative text-text-primary">
                <img src={avatarUrl} alt={user?.name} className="w-24 h-24 rounded-full mx-auto -mt-16 mb-4 border-4 border-background shadow-md" />
                <h3 className="text-center text-2xl font-bold">{user?.name || 'User Name'}</h3>
                <p className="text-center text-text-secondary mt-2 text-sm">{user?.bio || 'No bio available.'}</p>
                <div className="flex justify-center items-center space-x-4 mt-4 text-sm">
                    <button onClick={onFollowersClick} className="text-center hover:text-indigo-400">
                        <b className="text-text-primary">{followersCount}</b>
                        <span className="text-xs text-text-secondary block">Followers</span>
                    </button>
                    <button onClick={onFollowingClick} className="text-center hover:text-indigo-400">
                        <b className="text-text-primary">{followingCount}</b>
                        <span className="text-xs text-text-secondary block">Following</span>
                    </button>
                </div>
                <button onClick={onProfileClick} className="mt-6 w-full bg-white/20 dark:bg-black/20 text-text-primary font-semibold py-2 px-4 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;