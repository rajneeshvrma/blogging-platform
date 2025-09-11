import React, { useState } from 'react';
import { ImageIcon } from '../common/Icons';
import InputField from '../common/InputField';

const BlogEditor = ({ blogToEdit, onSave, onCancel }) => {
    const [title, setTitle] = useState(blogToEdit?.title || '');
    const [content, setContent] = useState(blogToEdit?.content || '');
    const [image, setImage] = useState(blogToEdit?.imageUrl || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: blogToEdit?.id, title, content, imageUrl: image });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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
                onChange={(e) => e.target.files?.[0] && setImage(URL.createObjectURL(e.target.files[0]))}
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
            <div className="flex justify-end mt-4 space-x-3">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 font-semibold text-white">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-semibold">Save</button>
            </div>
        </form>
    );
};

export default BlogEditor;