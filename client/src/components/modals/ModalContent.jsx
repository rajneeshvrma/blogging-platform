import React from 'react';
import ProfileEditForm from '../profile/ProfileEditForm';
import ShareOptions from './ShareOptions';
import FollowList from './FollowList';
import BlogEditor from '../post/BlogEditor';
import SearchResults from './SearchResults';
import BlogPostModal from './BlogPostModal';

const ModalContent = ({ type, data, onSaveBlog, onSaveProfile, onClose, blogs, currentUser, onFollow, onProfileClick, allUsers, openModal }) => {
    switch (type) {
        case 'editProfile':
            return <ProfileEditForm user={data} onSave={onSaveProfile} onCancel={onClose} />;
        case 'share':
            return <ShareOptions blog={data} />;
        case 'likers':
            // The user list for 'likers' needs to be derived from the 'likes' array
            const likerUsers = data.map(like => allUsers.find(u => u.id === like.id || u.name === like.name)).filter(Boolean);
            return <FollowList title="Likers" users={likerUsers} currentUser={currentUser} onFollow={onFollow} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'createPost':
            return <BlogEditor blogToEdit={data} onSave={onSaveBlog} onCancel={onClose} />;
        case 'search':
            return <SearchResults data={data} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'followers':
        case 'following':
            // The user list for 'followers'/'following' needs to be derived from the user ID array
            const userList = data.list.map(id => allUsers.find(u => u.id === id)).filter(Boolean);
            return <FollowList title={data.title} users={userList} currentUser={currentUser} onFollow={onFollow} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'viewPost':
            return <BlogPostModal blog={data} currentUser={currentUser} onEdit={(b) => { onClose(); openModal('createPost', b); }} />;
        default:
            return null;
    }
};

export default ModalContent;