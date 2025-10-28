import React, { useState } from 'react';
import { TwitterIcon, FacebookIcon, LinkedinIcon, WhatsAppIcon } from '../common/Icons';

const ShareOptions = ({ blog }) => {
    if (!blog || !(blog.id || blog._id) || !blog.title) {
        return <p className="text-text-secondary">Cannot generate share links: Blog data is missing.</p>;
    }

    const baseUrl = window.location.origin;
    const postId = blog.id || blog._id;
    const url = `${baseUrl}/post/${postId}`;
    const text = `Check out this blog post: ${blog.title}`;
    const summary = typeof blog.content === 'string' ? blog.content.substring(0, 100) + '...' : '';


    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(summary)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    };

    const [copied, setCopied] = useState(false);
    const copyToClipboard = async () => {
        if (!navigator.clipboard) {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                alert('Failed to copy link.');
            }
            document.body.removeChild(textArea);
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
            } catch (err) {
                console.error('Async: Could not copy text: ', err);
                alert('Failed to copy link.');
            }
        }
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <div className="space-y-4 text-text-primary">
            <p className="text-sm text-text-secondary">Share this post via:</p>
            <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg">
                <input type="text" readOnly value={url} className="w-full bg-transparent text-sm text-white/80 outline-none" aria-label="Post URL"/>
                <button onClick={copyToClipboard} className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-600 transition w-20 text-center">
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
            <div className="flex justify-around pt-2">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition" aria-label="Share on Twitter">
                    <TwitterIcon />
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition" aria-label="Share on Facebook">
                    <FacebookIcon className="w-6 h-6 fill-current"/>
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition" aria-label="Share on LinkedIn">
                    {/* Correct usage */}
                    <LinkedinIcon />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition" aria-label="Share on WhatsApp">
                    <WhatsAppIcon className="w-6 h-6 fill-current"/>
                </a>
            </div>
        </div>
    );
};

export default ShareOptions;