import React, { useState } from 'react';
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
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [coverPreview, setCoverPreview] = useState(user.coverPhoto);

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            if (type === 'avatar') {
                setAvatarPreview(fileUrl);
                setProfileData(p => ({ ...p, avatar: fileUrl }));
            } else {
                setCoverPreview(fileUrl);
                setProfileData(p => ({ ...p, coverPhoto: fileUrl }));
            }
        }
    };

    const handleChange = (e) => setProfileData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(profileData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <ImageUploadField label="Profile Photo" preview={avatarPreview} type="avatar" onChange={handleFileChange} />
            <ImageUploadField label="Cover Photo" preview={coverPreview} type="cover" onChange={handleFileChange} isCover />
            <InputField label="Name" name="name" value={profileData.name} onChange={handleChange} />
            <InputField label="Bio" name="bio" value={profileData.bio} onChange={handleChange} isTextarea />
            <InputField label="Website URL" name="website" value={profileData.website || ''} onChange={handleChange} placeholder="https://your-site.com" />
            <InputField label="Twitter Username" name="twitter" value={profileData.twitter || ''} onChange={handleChange} placeholder="your_handle" />
            <InputField label="LinkedIn Username" name="linkedin" value={profileData.linkedin || ''} onChange={handleChange} placeholder="your-profile" />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-semibold">Save Changes</button>
            </div>
        </form>
    );
};

export default ProfileEditForm;