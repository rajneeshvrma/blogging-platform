import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAuth';
import { LogoIcon, SearchIcon, SunIcon, MoonIcon } from '../common/Icons';

const Navbar = () => {
    const { isAuthenticated, logout, theme, toggleTheme } = useAppContext();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isAtTop = !isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
        closeMobileMenu();
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        const query = searchQuery.trim();
        if (query) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setSearchQuery('');
            closeMobileMenu();
        }
    };

    return (
        <>
            <div className="hidden md:block">
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAtTop ? 'py-6' : 'py-2'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center space-x-4 h-16">
                            <Link to="/" className="group text-text-primary font-bold text-xl tracking-wider bg-glass backdrop-blur-lg border border-glass rounded-full px-4 py-2 flex items-center space-x-2 transition-all duration-300">
                                <LogoIcon />
                                <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">
                                    GlassBlog
                                </span>
                            </Link>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="group flex items-center bg-glass backdrop-blur-lg border border-glass rounded-full transition-all duration-300 hover:bg-white/20">
                                    <span className="pl-3 text-text-primary"> <SearchIcon /> </span>
                                    <input type="text" placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className=" w-full bg-transparent text-text-primary placeholder-text-secondary border-none  focus:outline-none focus:ring-0 max-w-0 group-hover:max-w-[200px] focus:max-w-[200px]  transition-all duration-300 ease-in-out cursor-pointer group-hover:cursor-text pl-2 pr-3 py-3 "
                                    />
                                </div>
                            </form>

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
            </div>
            
            <div className="md:hidden">
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAtTop ? 'py-6' : 'py-2'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" onClick={closeMobileMenu} className="group text-text-primary font-bold text-xl tracking-wider bg-glass backdrop-blur-lg border border-glass rounded-full px-4 py-2 flex items-center space-x-2 transition-all duration-300 z-50">
                                <LogoIcon />
                            </Link>
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-text-primary bg-glass backdrop-blur-lg border border-glass hover:bg-white/20 focus:outline-none z-50"
                                aria-label="Open main menu"
                            >
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>
                <div 
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
                    }
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                ></div>
                <div 
                    className={`fixed top-0 right-0 h-full w-4/5 max-w-xs z-50 p-6 flex flex-col space-y-6 overflow-y-auto 
                        bg-glass backdrop-blur-lg border-l border-glass 
                        transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`
                    }
                >
                    <div className="flex items-center justify-between">
                        <span className="text-text-primary font-bold text-lg">Menu</span>
                        <button 
                            onClick={closeMobileMenu} 
                            className="text-text-secondary hover:bg-white/20 hover:text-text-primary p-2 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSearchSubmit}>
                        <div className="group flex items-center bg-white/10 rounded-full border border-glass">
                            <span className="pl-3 text-text-primary"><SearchIcon /></span>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-text-primary placeholder-text-secondary border-none focus:outline-none focus:ring-0 max-w-full transition-all duration-300 ease-in-out pl-2 pr-3 py-3"
                            />
                        </div>
                    </form>

                    <nav className="flex flex-col space-y-2">
                        <Link to="/" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={closeMobileMenu}>Home</Link>
                        <Link to="/explore-blogs" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={closeMobileMenu}>Explore</Link>
                        <Link to="/categories" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={closeMobileMenu}>Categories</Link>
                        <Link to="/about" className="text-text-secondary hover:bg-white/20 hover:text-text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={closeMobileMenu}>About</Link>
                    </nav>
                    <div className="flex flex-col space-y-3 pt-4 border-t border-glass">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="bg-glass backdrop-blur-lg border border-glass text-text-secondary hover:bg-white/20 hover:text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors text-center" onClick={closeMobileMenu}>Dashboard</Link>
                                <button onClick={handleLogout} className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth" state={{ show: 'login' }} className="bg-glass backdrop-blur-lg border border-glass text-text-secondary hover:bg-white/20 hover:text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors text-center" onClick={closeMobileMenu}>Login</Link>
                                <Link to="/auth" state={{ show: 'register' }} className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors text-center" onClick={closeMobileMenu}>Sign Up</Link>
                            </>
                        )}
                    </div>
                    <div className="flex justify-center pt-4 border-t border-glass">
                        <button onClick={toggleTheme} className="text-text-secondary hover:bg-white/20 hover:text-text-primary p-2 rounded-full transition-colors">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;