import React from 'react';
import { FiLink } from 'react-icons/fi';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import Spinner from '../common/Spinner';

const UserProfileHeader = ({ profile, currentUser, onFollow, onEditProfile, onFollowersClick, onFollowingClick, isFollowingProcessing }) => {
    const isFollowing = currentUser?.following?.includes(profile._id) ?? false;
    const isOwnProfile = currentUser?.id === profile._id;

    const formatUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const websiteUrl = formatUrl(profile.website);
    const twitterUrl = profile.twitter ? `https://twitter.com/${profile.twitter.replace('@', '')}` : null;
    const linkedinUrl = profile.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : null;

    return (
        <div className="bg-glass backdrop-blur-xl border border-glass rounded-2xl shadow-lg overflow-hidden">
            <img
                src={profile.coverPhoto || 'https://placehold.net/7-600x800.png'}
                alt="Cover"
                className="w-full h-48 object-cover"
            />
            <div className="p-6 relative">
                <div className="flex justify-between items-start">
                    <img
                        src={profile.avatar || 'https://placehold.net/avatar-4.svg'}
                        alt={profile.name}
                        className="w-32 h-32 rounded-full -mt-20 border-4 border-background shadow-md"
                    />
                    <div className="pt-16">
                        {isOwnProfile ? (
                            <button onClick={() => onEditProfile(profile)} className="bg-white/20 dark:bg-black/20 text-text-primary font-semibold py-2 px-4 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors">Edit Profile</button>
                        ) : (
                            <button
                                onClick={() => onFollow(profile._id)}
                                disabled={isFollowingProcessing}
                                className={`py-2 px-6 rounded-full font-semibold transition-colors flex items-center justify-center min-w-[120px] ${isFollowing
                                    ? 'bg-white/20 dark:bg-black/20 text-text-primary hover:bg-white/30 dark:hover:bg-black/30 disabled:bg-opacity-50'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-400'
                                    } disabled:cursor-not-allowed`}
                            >
                                {isFollowingProcessing ? <Spinner small /> : (isFollowing ? 'Following' : 'Follow')}
                            </button>
                        )}
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-text-primary mt-4">{profile.name}</h3>
                <p className="text-text-secondary mt-2">{profile.bio}</p>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 text-sm text-text-secondary">
                    {websiteUrl && (
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-indigo-400 min-w-0" 
                        >
                            <FiLink className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{profile.website}</span>
                        </a>
                    )}
                    {twitterUrl && (
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-indigo-400 min-w-0" 
                        >
                            <FaTwitter className="mr-1 flex-shrink-0" />
                            <span className="truncate">{profile.twitter}</span>
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-indigo-400 min-w-0"
                        >
                            <FaLinkedin className="mr-1 flex-shrink-0" />
                            <span className="truncate">{profile.linkedin}</span>
                        </a>
                    )}
                </div>
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