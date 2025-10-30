import React from 'react';

const FollowList = ({ title, users, currentUser, onFollow, onProfileClick, onClose }) => (
    <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {users && users.length > 0 ? users.map(user => {
            if (!user) return null;
            const isFollowing = currentUser.following.includes(user.id);
            const isCurrentUser = currentUser.id === user.id;

            return (
                <li key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <button onClick={() => { onProfileClick(user); onClose(); }} className="flex items-center">
                        <img src={user.avatar || 'https://placehold.net/avatar-4.svg'} className="w-10 h-10 rounded-full mr-3" alt={user.name}/>
                        <span className="font-semibold">{user.name}</span>
                    </button>
                    {!isCurrentUser && (
                        <button onClick={() => onFollow(user.id)} className={`px-4 py-1 text-sm rounded-full font-semibold transition-colors ${isFollowing ? 'bg-white/20 text-white' : 'bg-indigo-500 text-white'}`}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </li>
            );
        }) : <p className="text-center text-white/70">No users to show.</p>}
    </ul>
);

export default FollowList;