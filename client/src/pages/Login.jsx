import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAuth';
import Button from '../components/common/Button';

const AuthPageWrapper = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden grid md:grid-cols-2">
            <div className="p-8 md:p-12">
                {children}
            </div>
            <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/600x800/1B263B/415A77?text=GlassBlog')_"}}>
                 <div className="w-full h-full bg-black/30 p-8 flex flex-col justify-end">
                    <h2 className="text-3xl font-bold text-white">Join a Community of Thinkers</h2>
                    <p className="text-gray-300 mt-2">Share your ideas, connect with others, and grow your audience on a platform that values quality.</p>
                </div>
            </div>
        </div>
    </div>
);

const LoginPage = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            setPage({ name: 'home' });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <AuthPageWrapper>
            <div><h2 className="text-center text-3xl font-extrabold text-text-primary">Sign In</h2></div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <p className="text-red-400 text-center">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary">Email Address</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 appearance-none relative block w-full px-3 py-2 border border-glass placeholder-text-secondary text-text-primary bg-transparent rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 appearance-none relative block w-full px-3 py-2 border border-glass placeholder-text-secondary text-text-primary bg-transparent rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
                    </div>
                </div>
                <Button type="submit" isLoading={isLoading}>Sign in</Button>
            </form>
            <p className="mt-4 text-center text-sm text-text-secondary">
                Don't have an account?{' '}
                <a href="#" onClick={() => setPage({name: 'register'})} className="font-medium text-indigo-400 hover:text-indigo-300">
                    Sign up
                </a>
            </p>
        </AuthPageWrapper>
    );
};

export default LoginPage;