import React, { useState } from 'react';
import { TwitterIcon, FacebookIcon, LinkedinIcon, WhatsAppIcon } from '../common/Icons';

const ShareOptions = ({ blog }) => {
    const url = `${window.location.href.split('#')[0]}#blog-${blog.id}`;
    const text = `Check out this blog post: ${blog.title}`;
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.content.substring(0, 100))}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    };

    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg">
                <input type="text" readOnly value={url} className="w-full bg-transparent text-sm text-white/80 outline-none" />
                <button onClick={copyToClipboard} className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-600 transition">{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <div className="flex justify-around">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/20 transition"><TwitterIcon className="w-6 h-6" /></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/20 transition"><FacebookIcon className="w-6 h-6" /></a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/20 transition"><LinkedInIcon className="w-6 h-6" /></a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/20 transition"><WhatsAppIcon className="w-6 h-6" /></a>
            </div>
        </div>
    );
};

export default ShareOptions;