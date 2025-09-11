import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAuth';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { postService } from '../api/postService';
import PostCard from '../components/post/PostCard';
import Spinner from '../components/common/Spinner';
import Footer from '../components/layout/Footer';
import { EditIcon, HeartIcon, UserIcon, CompassIcon, ImageIcon, CommentIcon } from '../components/common/Icons';
// --- Helper Components for Animations and FAQ ---

const AnimatedSection = ({ children, className }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    return (
        <AnimatedSection>
            <div className="bg-glass p-6 rounded-lg border border-glass cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <summary className="font-semibold text-lg text-text-primary flex justify-between items-center list-none">
                    {question}
                    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </summary>
                <div
                    ref={contentRef}
                    style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                >
                    <p className="mt-4 text-text-secondary">{answer}</p>
                </div>
            </div>
        </AnimatedSection>
    );
};

// --- The Main HomePage Component ---

const HomePage = () => {
    const { isAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const fetchedPosts = await postService.getPosts();
            setPosts(fetchedPosts.slice(0, 3)); // Show only 3 for landing page
            setLoading(false);
        };
        fetchPosts();
    }, []);
    
    const categories = ["Tech", "Travel", "Lifestyle", "Finance", "Health", "Food"];

    return (
        <>
            {/* Hero Section */}
            <div className="relative h-[100vh] overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20">
                    <source src="https://cdn.pixabay.com/video/2024/03/26/205691-927672681_large.mp4" type="video/mp4" />
                </video>
                <div className="relative z-10 text-center py-20 px-4 h-full flex flex-col items-center justify-center">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary leading-tight">Share Your Stories with the World</h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">Create, edit, and explore blogs with likes, comments, and community support.</p>
                        <div className="mt-8 flex justify-center space-x-4">
                            <button onClick={() => navigate(isAuthenticated ? '/create-post' : '/auth', { state: { show: 'register' } })} className="bg-indigo-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-600 transition-colors">Create a Blog</button>
                            <button onClick={() => navigate('/explore-blogs')} className="bg-glass border border-glass text-text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/20 transition-colors">Explore Blogs</button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Features Section */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center"><div className="bg-glass p-4 rounded-full border border-glass"><EditIcon /></div><h3 className="mt-4 text-xl font-bold text-text-primary">Rich Text Editor</h3><p className="mt-2 text-text-secondary">Create beautiful blogs with an intuitive editor.</p></div>
                    <div className="flex flex-col items-center"><div className="bg-glass p-4 rounded-full border border-glass"><HeartIcon className="w-6 h-6 text-text-primary" /></div><h3 className="mt-4 text-xl font-bold text-text-primary">Like & Comment</h3><p className="mt-2 text-text-secondary">Engage with posts and connect with authors.</p></div>
                    <div className="flex flex-col items-center"><div className="bg-glass p-4 rounded-full border border-glass"><UserIcon /></div><h3 className="mt-4 text-xl font-bold text-text-primary">Manage Profile</h3><p className="mt-2 text-text-secondary">Customize your profile and manage your posts.</p></div>
                    <div className="flex flex-col items-center"><div className="bg-glass p-4 rounded-full border border-glass"><CompassIcon /></div><h3 className="mt-4 text-xl font-bold text-text-primary">Discover Blogs</h3><p className="mt-2 text-text-secondary">Explore content from a diverse community of writers.</p></div>
                </div>
            </AnimatedSection>

            {/* Why Choose Us Section */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-7xl mx-auto"><h2 className="text-4xl font-extrabold text-text-primary text-center mb-12">Why Choose GlassBlog?</h2><div className="grid md:grid-cols-2 gap-8 items-center"><div className="space-y-8"><div className="flex items-start space-x-4"><div className="bg-glass p-3 rounded-full border border-glass mt-1"><ImageIcon className="w-6 h-6" /></div><div><h3 className="text-xl font-bold text-text-primary">Unmatched Aesthetics</h3><p className="mt-1 text-text-secondary">Our unique glassmorphism design provides a clean, modern, and visually stunning reading and writing experience.</p></div></div><div className="flex items-start space-x-4"><div className="bg-glass p-3 rounded-full border border-glass mt-1"><CommentIcon className="w-6 h-6" /></div><div><h3 className="text-xl font-bold text-text-primary">Community Focused</h3><p className="mt-1 text-text-secondary">We're more than a platform; we're a community. Engage with writers, get feedback, and grow together.</p></div></div></div><div><img src="https://placehold.co/600x400/1B263B/415A77?text=Community" alt="Community" className="rounded-xl shadow-2xl" /></div></div></div>
            </AnimatedSection>

            {/* Trending Blogs Section */}
            <AnimatedSection id="blog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-4xl font-extrabold text-text-primary text-center mb-12">Featured / Trending Blogs</h2>
                {loading ? <div className="flex justify-center"><Spinner /></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (<PostCard key={post.id} post={post} />))}
                    </div>
                )}
            </AnimatedSection>

            {/* Popular Categories */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-5xl mx-auto text-center"><h2 className="text-3xl font-bold text-text-primary">Popular Categories</h2><div className="mt-10 flex flex-wrap justify-center gap-4">{categories.map(cat => (<button key={cat} onClick={() => navigate('/categories')} className="bg-glass backdrop-blur-sm border border-glass text-text-primary px-5 py-2 rounded-full font-semibold hover:bg-white/20 transition-colors">{cat}</button>))}</div></div>
            </AnimatedSection>
            
            {/* Community Stats & Testimonials Section */}
            <AnimatedSection className="py-20 px-4">
                 <div className="max-w-5xl mx-auto text-center"><div className="grid grid-cols-3 gap-8 mb-10"><div><p className="text-4xl font-bold text-indigo-400">5,000+</p><p className="text-text-secondary mt-2">Blogs Shared</p></div><div><p className="text-4xl font-bold text-indigo-400">1,200+</p><p className="text-text-secondary mt-2">Active Users</p></div><div><p className="text-4xl font-bold text-indigo-400">10k+</p><p className="text-text-secondary mt-2">Monthly Views</p></div></div><h2 className="text-3xl font-bold text-text-primary">Join a growing community of storytellers!</h2><div className="mt-10 grid md:grid-cols-2 gap-8"><div className="bg-glass p-8 rounded-xl border border-glass text-left"><p className="text-text-secondary">"GlassBlog has transformed my writing experience. The interface is just beautiful and lets me focus on what truly matters: the words."</p><p className="mt-4 font-bold text-text-primary">- Alex Chen</p></div><div className="bg-glass p-8 rounded-xl border border-glass text-left"><p className="text-text-secondary">"Finally, a blogging platform that values design as much as functionality. My readers love the clean look of my new blog."</p><p className="mt-4 font-bold text-text-primary">- Jasmine Kaur</p></div></div></div>
            </AnimatedSection>
            
            {/* FAQ Section */}
            <div className="py-20 px-4">
                <div className="max-w-3xl mx-auto"><h2 className="text-4xl font-extrabold text-text-primary text-center mb-12">Frequently Asked Questions</h2><div className="space-y-4"><FaqItem question="Is GlassBlog free to use?" answer="Yes, GlassBlog is completely free for both readers and writers. You can sign up and start publishing your stories today without any cost." /><FaqItem question="Can I customize my blog's appearance?" answer="While we maintain a consistent and beautiful design across the platform, you can customize your profile page with a banner, profile picture, and bio to express your personality." /><FaqItem question="How do I get my blog featured?" answer="Our editorial team regularly reviews new content. High-quality, engaging, and original posts have the best chance of being featured on our homepage and in our newsletter." /></div></div>
            </div>
            
            {/* CTA Section */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-glass p-12 rounded-xl border border-glass"><h2 className="text-4xl font-bold text-text-primary">Ready to share your thoughts?</h2><p className="mt-4 text-text-secondary">Start your blog today!</p><div className="mt-8 flex justify-center"><button onClick={() => navigate('/auth', { state: { show: 'register' } })} className="bg-indigo-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-600 transition-colors">Get Started / Join Now</button></div></div>
            </AnimatedSection>

            <Footer />
        </>
    );
};

export default HomePage;