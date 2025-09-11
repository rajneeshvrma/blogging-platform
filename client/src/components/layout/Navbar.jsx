import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAuth';
import { LogoIcon, SearchIcon, SunIcon, MoonIcon } from '../common/Icons';

const Navbar = () => {
    const { isAuthenticated, logout, theme, toggleTheme } = useAppContext();
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if the current page is the home page at the top of the scroll
    const isHomePageAtTop = location.pathname === '/' && !isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHomePageAtTop ? 'py-6' : 'py-2'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center space-x-4 h-16">
                        <Link to="/" className="group text-text-primary font-bold text-xl tracking-wider bg-glass backdrop-blur-lg border border-glass rounded-full px-4 py-2 flex items-center space-x-2 transition-all duration-300">
                            <LogoIcon />
                            <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">
                                GlassBlog
                            </span>
                        </Link>

                        {/* --- MODIFIED SEARCH BAR --- */}
                        <div className="group flex items-center bg-glass backdrop-blur-lg border border-glass rounded-full transition-all duration-300 hover:bg-white/20">
                            <span className="pl-3 text-text-primary">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="
                                    w-full bg-transparent text-text-primary placeholder-text-secondary border-none 
                                    focus:outline-none focus:ring-0
                                    max-w-0 group-hover:max-w-[200px] focus:max-w-[200px] 
                                    transition-all duration-300 ease-in-out
                                    cursor-pointer group-hover:cursor-text
                                    pl-2 pr-3 py-3
                                "
                            />
                        </div>

                        <div className="bg-glass backdrop-blur-lg rounded-full px-3 py-2 flex items-center space-x-1 border border-glass">
                            <Link to="/" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-1 rounded-full text-sm font-medium transition-colors">Home</Link>
                            <Link to="/explore-blogs" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-1 rounded-full text-sm font-medium transition-colors">Explore</Link>
                            <Link to="/categories" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-1 rounded-full text-sm font-medium transition-colors">Categories</Link>
                            <Link to="/about" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-1 rounded-full text-sm font-medium transition-colors">About</Link>
                            <button onClick={toggleTheme} className="text-text-secondary hover:bg-white/20 hover:text-text-primary p-2 rounded-full transition-colors">
                                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="bg-glass backdrop-blur-lg border border-glass text-text-secondary hover:bg-white/20 hover:text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors">Dashboard</Link>

                                    <button onClick={handleLogout} className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/auth" state={{ show: 'login' }} className="bg-glass backdrop-blur-lg border border-glass text-text-secondary hover:bg-white/20 hover:text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors">Login</Link>
                                    <Link to="/auth" state={{ show: 'register' }} className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;