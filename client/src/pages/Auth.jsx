import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../hooks/useAuth';
import Button from '../components/common/Button';

// A simple, reusable input for non-password fields
const FormInput = ({ id, label, type, value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-glass placeholder-text-secondary text-text-primary bg-transparent rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={placeholder}
        />
    </div>
);

// New: A dedicated component for password inputs with a show/hide toggle
const PasswordInput = ({ id, label, value, onChange, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(prev => !prev);

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
            <div className="relative mt-1">
                <input
                    id={id}
                    name={id}
                    type={isVisible ? 'text' : 'password'}
                    required
                    value={value}
                    onChange={onChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-glass placeholder-text-secondary text-text-primary bg-transparent rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-text-secondary hover:text-text-primary"
                >
                    {isVisible ? (
                        // Hide Icon (Eye with slash)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.117-2.117" />
                        </svg>
                    ) : (
                        // Show Icon (Eye)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

const PasswordStrengthIndicator = ({ strength }) => {
    // ... (This component remains unchanged from the previous version)
    const strengthLabels = ["Weak", "Medium", "Strong", "Very Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    return (
        <div className="flex items-center mt-2 space-x-2">
            <div className="w-full bg-gray-700 rounded-full h-2"><motion.div className={`h-2 rounded-full ${strengthColors[strength]}`} initial={{ width: 0 }} animate={{ width: `${((strength + 1) / 4) * 100}%` }} transition={{ duration: 0.5 }} /></div>
            <span className="text-xs text-text-secondary w-24 text-right">{strengthLabels[strength]}</span>
        </div>
    );
};

const formVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, }, }, };
const formItemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, }, }, };

const AuthPage = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.show !== 'register');
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAppContext();
    const toggleAuthMode = (e) => { e?.preventDefault(); setIsLogin(prev => !prev); };
    useEffect(() => { setIsLogin(location.state?.show !== 'register'); }, [location.state]);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || (!loading && isAuthenticated)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover -z-10" src="https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-and-pink-lines-of-light-35111-large.mp4" />

            {/* Change: Layout is restored to the larger, split-panel container */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative w-full max-w-4xl h-[600px] bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden" >
                <div className="w-full h-full relative overflow-hidden">
                    {/* Form Panel */}
                    <motion.div animate={{ x: isLogin ? '0%' : '100%' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="absolute top-0 left-0 w-1/2 h-full p-8 md:p-12 z-20 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div key={isLogin ? 'login' : 'register'} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }} >
                                {isLogin ? <LoginForm toggleAuthMode={toggleAuthMode} /> : <RegisterForm toggleAuthMode={toggleAuthMode} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Change: The Image Panel is back */}
                    <motion.div animate={{ x: isLogin ? '0%' : '-100%' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="absolute top-0 right-0 w-1/2 h-full z-50" >
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/600x800/1B263B/415A77?text=GlassBlog')" }}>
                            <div className="w-full h-full bg-black/30 p-8 flex flex-col justify-end text-white">
                                <AnimatePresence mode="wait">
                                    <motion.div key={isLogin ? 'join' : 'welcome'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} >
                                        <h2 className="text-3xl font-bold">{isLogin ? 'Join a Community of Thinkers' : 'Welcome Back!'}</h2>
                                        <p className="text-gray-300 mt-2">{isLogin ? 'Share your ideas, connect with others, and grow your audience.' : 'Login and pick up where you left off. We missed you!'}</p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const LoginForm = ({ toggleAuthMode }) => {
    // ... (logic and state are the same)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try { 
            await login(email, password);
            navigate('/dashboard', { replace: true }); 
        } catch (err) { setError(err?.message || 'Login failed'); 
        } finally { setIsLoading(false); }
    };

    return (
        <motion.div variants={formVariants} initial="hidden" animate="visible">
            <motion.h2 variants={formItemVariants} className="text-center text-3xl font-extrabold text-text-primary">Sign In</motion.h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <p className="text-red-400 text-center">{error}</p>}
                <motion.div variants={formItemVariants}><FormInput id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></motion.div>
                {/* Change: Using the new PasswordInput component */}
                <motion.div variants={formItemVariants}><PasswordInput id="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></motion.div>
                <motion.div variants={formItemVariants}><Button type="submit" isLoading={isLoading}>Sign in</Button></motion.div>
            </form>
            <motion.p variants={formItemVariants} className="mt-4 text-center text-sm text-text-secondary">
                Don't have an account?{' '}
                <button onClick={toggleAuthMode} className="font-medium text-indigo-400 hover:text-indigo-300 underline">Sign up</button>
            </motion.p>
        </motion.div>
    );
};

const RegisterForm = ({ toggleAuthMode }) => {
    // ... (logic and state are the same as the previous version)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [strength, setStrength] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAppContext();

    useEffect(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        setStrength(Math.min(score, 3));
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { setError("Passwords do not match!"); return; }
        setError('');
        setIsLoading(true);
        try { await register(name, email, password); } catch (err) { setError(err?.message || 'Registration failed'); } finally { setIsLoading(false); }
    };

    return (
        <motion.div variants={formVariants} initial="hidden" animate="visible">
            <motion.h2 variants={formItemVariants} className="text-center text-3xl font-extrabold text-text-primary">Create an Account</motion.h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <p className="text-red-400 text-center">{error}</p>}
                <motion.div variants={formItemVariants}><FormInput id="name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" /></motion.div>
                <motion.div variants={formItemVariants}><FormInput id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></motion.div>
                <motion.div variants={formItemVariants}>
                    {/* Change: Using the new PasswordInput component */}
                    <PasswordInput id="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    {password.length > 0 && <PasswordStrengthIndicator strength={strength} />}
                </motion.div>
                <motion.div variants={formItemVariants}>
                    {/* Change: Using the new PasswordInput component for confirmation */}
                    <PasswordInput id="confirmPassword" label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </motion.div>
                <motion.div variants={formItemVariants}><Button type="submit" isLoading={isLoading}>Create Account</Button></motion.div>
            </form>
            <motion.p variants={formItemVariants} className="mt-4 text-center text-sm text-text-secondary">
                Already have an account?{' '}
                <button onClick={toggleAuthMode} className="font-medium text-indigo-400 hover:text-indigo-300 underline">Sign in</button>
            </motion.p>
        </motion.div>
    );
};

export default AuthPage;