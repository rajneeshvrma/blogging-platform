import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, onClick, type = 'button', className = '', isLoading = false }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={isLoading}
        className={`w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors ${className}`}
    >
        {isLoading ? <Spinner small /> : children}
    </button>
);

export default Button;