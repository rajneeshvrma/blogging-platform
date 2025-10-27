import React, { useState } from 'react';
import axios from 'axios';
import { ImageIcon } from '../common/Icons';
import InputField from '../common/InputField';

const BlogEditor = ({ blogToEdit, onSave, onCancel }) => {
    const isEditing = Boolean(blogToEdit); 

    const [title, setTitle] = useState(blogToEdit?.title || '');
    const [content, setContent] = useState(blogToEdit?.content || '');
    
    
    const [image, setImage] = useState(blogToEdit?.imageUrl || null);
    
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    
    const [scheduleDate, setScheduleDate] = useState(
        blogToEdit?.status === 'scheduled' && blogToEdit?.publishedAt 
        ? new Date(blogToEdit.publishedAt).toISOString().slice(0, 16) 
        : ''
    );
    

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file)); 
            setImageFile(file); 
        }
    };

    
    const handleSubmit = async (action) => {
        setIsUploading(true);
        let uploadedImageUrl = image; 
        let postData = {};

        try {
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const token = sessionStorage.getItem('token');
                const { data } = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                uploadedImageUrl = data.image; 
            }

            
            postData = {
                id: blogToEdit?._id, 
                title,
                content,
                imageUrl: uploadedImageUrl,
                
                
            };

            
            switch (action) {
                case 'draft':
                    postData.status = 'draft';
                    break;
                case 'schedule':
                    postData.status = 'scheduled';
                    postData.publishedAt = new Date(scheduleDate);
                    break;
                case 'publish':
                default:
                    postData.status = 'published';
                    postData.publishedAt = new Date();
                    break;
            }

            
            onSave(postData);

        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <label htmlFor="blog-image" className="w-full h-48 flex justify-center items-center border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/10 transition">
                {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg"/>
                ) : (
                    <div className="text-center text-white/50">
                        <ImageIcon className="w-12 h-12 mx-auto" />
                        <p>Cover Image</p>
                    </div>
                )}
            </label>
            <input
                id="blog-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />
            <InputField
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <InputField
                label="Content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                isTextarea
            />
            
            <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Schedule Post (Optional)</label>
                <input 
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white"
                />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 font-semibold text-white" disabled={isUploading}>
                    Cancel
                </button>
                
                <button 
                    type="button" 
                    onClick={() => handleSubmit('draft')} 
                    className="px-4 py-2 rounded-full bg-gray-500 hover:bg-gray-600 font-semibold text-white" 
                    disabled={isUploading}>
                    {isUploading ? 'Saving...' : 'Save Draft'}
                </button>
                
                <button 
                    type="button" 
                    
                    onClick={() => handleSubmit(scheduleDate ? 'schedule' : 'publish')} 
                    className="px-6 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-semibold" 
                    disabled={isUploading}>
                    
                    {isUploading ? 'Saving...' : (scheduleDate ? 'Schedule' : (isEditing ? 'Save Changes' : 'Publish'))}
                </button>
            </div>
        </div>
    );
};

export default BlogEditor;