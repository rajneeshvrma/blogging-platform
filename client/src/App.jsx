import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from './hooks/useAuth';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePost';
import GenericPage from './pages/GenericPage';
import UserProfilePage from './pages/UserProfilePage';
import PostDetailsPage from './pages/PostDetails';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAppContext();
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AppContent = () => {
    const { theme } = useAppContext();
    const location = useLocation();
    
    // FIX: Simplified the layout check.
    // The 'pt-32' class was causing the large gap. It's better handled
    // within each page component itself for more control.
    const isSpecialLayout = location.pathname === '/auth' || location.pathname === '/';

    useEffect(() => {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = theme === 'dark' 
                ? '/darkmode logo glassblog.png' 
                : '/lightmode logo glassblog.png';
        }
    }, [theme]);

    return (
        <div className={theme}>
            <div className="min-h-screen font-sans transition-colors duration-500 bg-background text-text-primary">
                <Navbar />
                {/* REMOVED: The className that added the top padding is gone. */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        
                        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                        <Route path="/profile/:userId" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
                        <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
                        
                        {/* ADDED: Route for viewing a single post */}
                        <Route path="/post/:slug" element={<PostDetailsPage />} />

                        <Route path="/about" element={<GenericPage title="About Us" text="Welcome to GlassBlog." />} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </main>
                {/* FIX: The Footer will now correctly appear on pages where it should. */}
                {!isSpecialLayout && <Footer />}
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;