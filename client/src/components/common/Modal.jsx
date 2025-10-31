import React from 'react';
import { CloseIcon } from './Icons';

const Modal = ({ children, onClose, title, size = 'md' }) => {
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-full ${sizeClasses[size]} text-white transform transition-all duration-300 scale-95 animate-slide-up`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-white/20">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;