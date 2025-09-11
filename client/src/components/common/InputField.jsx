import React from 'react';

const InputField = ({ label, name, value, onChange, placeholder, isTextarea = false }) => (
    <div>
        <label className="block text-sm font-medium text-white/70">{label}</label>
        {isTextarea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows="3"
                placeholder={placeholder}
                className="mt-1 w-full p-2 bg-white/10 rounded-md border-2 border-transparent focus:border-indigo-500 focus:bg-white/20 outline-none transition"
            />
        ) : (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="mt-1 w-full p-2 bg-white/10 rounded-md border-2 border-transparent focus:border-indigo-500 focus:bg-white/20 outline-none transition"
            />
        )}
    </div>
);

export default InputField;