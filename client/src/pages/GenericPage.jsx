import React from 'react';

const GenericPage = ({ title, text }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-primary text-center">
        <div className="bg-glass backdrop-blur-md rounded-xl shadow-lg border border-glass p-10">
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-text-secondary">{text}</p>
        </div>
    </div>
);

export default GenericPage;