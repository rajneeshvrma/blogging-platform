import React, { useState } from 'react';
import axios from 'axios';
import { ImageIcon } from '../common/Icons';
import InputField from '../common/InputField';
import Spinner from '../common/Spinner'; 

const BlogEditor = ({ blogToEdit, onSave, onCancel }) => {
    const isEditing = Boolean(blogToEdit?._id || blogToEdit?.id);
    const originalStatus = blogToEdit?.status || 'published'; 

    const [title, setTitle] = useState(blogToEdit?.title || '');
    const [content, setContent] = useState(blogToEdit?.content || '');
    const [image, setImage] = useState(blogToEdit?.imageUrl || null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(
        (originalStatus === 'scheduled' && blogToEdit?.publishedAt)
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
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.post('/api/upload', formData, config);
                uploadedImageUrl = data.image;
            }

            postData = {
                ...(isEditing && { _id: blogToEdit._id || blogToEdit.id }),
                title,
                content,
                imageUrl: uploadedImageUrl,
                category: blogToEdit?.category || 'General',
            };

            switch (action) {
                case 'draft':
                    postData.status = 'draft';
                    postData.publishedAt = null;
                    break;
                case 'schedule':
                    if (!scheduleDate) {
                        alert("Please select a schedule date and time.");
                        setIsUploading(false);
                        return;
                    }
                    postData.status = 'scheduled';
                    postData.publishedAt = new Date(scheduleDate);
                    break;
                case 'publish':
                default:
                    if (action === 'publish' && isEditing && originalStatus === 'draft' && !scheduleDate) {
                        postData.status = 'published';
                        postData.publishedAt = new Date(); 
                        setScheduleDate('');
                    } else if (action === 'publish' && !isEditing && !scheduleDate) {
                        postData.status = 'published';
                        postData.publishedAt = new Date();
                        setScheduleDate('');
                    }
                    else if (isEditing && action !== 'schedule') {
                        postData.status = originalStatus; 
                        postData.publishedAt = scheduleDate ? new Date(scheduleDate) : (blogToEdit?.publishedAt || null);
                        if (scheduleDate) postData.status = 'scheduled'; 
                    }
                    else {
                        postData.status = 'published';
                        postData.publishedAt = new Date();
                        setScheduleDate('');
                    }
                    break;
            }

            onSave(postData);

        } catch (error) {
            console.error("Error saving post:", error.response?.data?.message || error.message);
            alert(`Error saving post: ${error.response?.data?.message || 'Please try again.'}`);
            setIsUploading(false);
        }
    };

    let mainButtonAction = scheduleDate ? 'schedule' : 'publish';
    let mainButtonText = 'Publish';

    if (isEditing) {
        if (originalStatus === 'draft') {
            mainButtonText = scheduleDate ? 'Schedule' : 'Publish';
        } else {
            mainButtonText = scheduleDate ? 'Schedule' : 'Save Changes';
            if (!scheduleDate) mainButtonAction = 'publish';
        }
    } else if (scheduleDate) {
        mainButtonText = 'Schedule';
    }

    const draftButtonText = isEditing ? 'Save Draft Changes' : 'Save Draft';


    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-text-primary">
            <label htmlFor="blog-image" className="w-full h-48 flex justify-center items-center border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/10 transition bg-black/20">
                {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <div className="text-center text-white/50">
                        <ImageIcon className="w-12 h-12 mx-auto" />
                        <p>Upload Cover Image (Optional)</p>
                    </div>
                )}
            </label>
            <input id="blog-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            <InputField label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your blog post title" />

            <InputField label="Content" name="content" value={content} onChange={(e) => setContent(e.target.value)} isTextarea placeholder="Write your story..." />

            <div>
                <label htmlFor="scheduleDate" className="block text-sm font-medium text-white/70 mb-1">Schedule Post (Optional)</label>
                <input
                    id="scheduleDate"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white placeholder-text-secondary focus:border-indigo-500 focus:ring-indigo-500"
                />
                {scheduleDate && <p className="text-xs text-indigo-400 mt-1">Post will be published automatically on the selected date.</p>}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-glass mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 font-semibold text-text-primary transition-colors" disabled={isUploading}>
                    Cancel
                </button>
                <button type="button" onClick={() => handleSubmit('draft')} className="px-4 py-2 rounded-full bg-gray-500 hover:bg-gray-600 font-semibold text-white transition-colors flex items-center" disabled={isUploading} >
                    {isUploading ? <Spinner small /> : draftButtonText}
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit(mainButtonAction)}
                    className="px-6 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-semibold transition-colors flex items-center"
                    disabled={isUploading || (!title || !content)}
                >
                    {isUploading ? <Spinner small /> : mainButtonText}
                </button>
            </div>
        </div>
    );
};

export default BlogEditor;