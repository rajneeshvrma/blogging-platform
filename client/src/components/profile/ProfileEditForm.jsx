import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../common/InputField';

const ImageUploadField = ({ label, preview, type, onChange, isCover }) => (
    <div>
        <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
        <div className="flex items-center space-x-4">
            <img src={preview} alt={label} className={`${isCover ? 'w-24 h-12' : 'w-16 h-16 rounded-full'} object-cover rounded-md`} />
            <label htmlFor={`${type}-upload`} className="cursor-pointer bg-white/20 px-3 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/30">
                Change
            </label>
            <input
                id={`${type}-upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onChange(e, type)}
            />
        </div>
    </div>
);


const ProfileEditForm = ({ user, onSave, onCancel }) => {
    const [profileData, setProfileData] = useState(user);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || 'https://placehold.net/avatar-4.svg');
    const [coverPreview, setCoverPreview] = useState(user.coverPhoto || 'https://placehold.net/7-600x800.png');
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false); 

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileUrl = URL.createObjectURL(file); 

            if (type === 'avatar') {
                setAvatarPreview(fileUrl); 
                setAvatarFile(file);     
            } else {
                setCoverPreview(fileUrl);
                setCoverFile(file);       
            }
            
        }
    };

    const handleChange = (e) => setProfileData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        let avatarUrl = profileData.avatar;
        let coverUrl = profileData.coverPhoto;

        try {
            const uploadImage = async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                
                const storedUser = JSON.parse(sessionStorage.getItem('user'));
                const token = storedUser?.token;

                const { data } = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                return data.image;
            };

            if (avatarFile) {
                avatarUrl = await uploadImage(avatarFile);
            }

            if (coverFile) {
                coverUrl = await uploadImage(coverFile);
            }

            const updatedProfileData = {
                ...profileData,
                avatar: avatarUrl,
                coverPhoto: coverUrl,
            };

            onSave(updatedProfileData);

        } catch (error) {
            console.error('Error uploading image or saving profile:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <ImageUploadField label="Profile Photo" preview={avatarPreview} type="avatar" onChange={handleFileChange} />
            <ImageUploadField label="Cover Photo" preview={coverPreview} type="cover" onChange={handleFileChange} isCover />
            <InputField label="Name" name="name" value={profileData.name} onChange={handleChange} />
            <InputField label="Bio" name="bio" value={profileData.bio} onChange={handleChange} isTextarea />
            <InputField label="Website URL" name="website" value={profileData.website || ''} onChange={handleChange} placeholder="https://your-site.com" />
            <InputField label="Twitter Username" name="twitter" value={profileData.twitter || ''} onChange={handleChange} placeholder="your username" />
            <InputField label="LinkedIn Username" name="linkedin" value={profileData.linkedin || ''} onChange={handleChange} placeholder="your username" />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-semibold">Save Changes</button>
            </div>
        </form>
    );
};

export default ProfileEditForm;