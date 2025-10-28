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
            return <FollowList title="Liked By" users={data || []} currentUser={currentUser} onFollow={onFollow} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'createPost':
            return <BlogEditor blogToEdit={data} onSave={onSaveBlog} onCancel={onClose} />;
        case 'search':
            return <SearchResults data={data} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'followers':
        case 'following':
            return <FollowList title={data?.title || type.charAt(0).toUpperCase() + type.slice(1)} users={data?.list || []} currentUser={currentUser} onFollow={onFollow} onProfileClick={onProfileClick} onClose={onClose} />;
        case 'viewPost':
            return <BlogPostModal blog={data} currentUser={currentUser} onEdit={(b) => { onClose(); openModal('createPost', b); }} />;
        default:
            console.warn("ModalContent received unknown type:", type);
            return <p className="text-text-secondary">Content type not recognized.</p>; 
    }
};

export default ModalContent;