import React, { useEffect } from 'react'; // 1. ADD 'useEffect' to this import
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

// A component to protect routes that require a user to be logged in
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAppContext();
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AppContent = () => {
    const { theme } = useAppContext();
    const location = useLocation();
    const isSpecialLayout = location.pathname === '/auth' || location.pathname === '/';

    // 2. --- ADD THIS ENTIRE BLOCK OF CODE ---
    useEffect(() => {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            // This updates the icon based on the current theme
            favicon.href = theme === 'dark' 
                ? '/darkmode logo glassblog.png' 
                : '/lightmode logo glassblog.png';
        }
    }, [theme]);
    // ------------------------------------------

    return (
        <div className={theme}>
            <div className="min-h-screen font-sans transition-colors duration-500 bg-background text-text-primary">
                <Navbar />
                <main className={isSpecialLayout ? '' : 'pt-32'}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        } />

                        <Route path="/profile/:userId" element={
                            <PrivateRoute>
                                <UserProfilePage />
                            </PrivateRoute>
                        } />

                        <Route path="/create-post" element={
                            <PrivateRoute>
                                <CreatePostPage />
                            </PrivateRoute>
                        } />

                        <Route path="/about" element={<GenericPage title="About Us" text="Welcome to GlassBlog." />} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </main>
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