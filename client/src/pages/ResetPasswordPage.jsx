import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useAppContext } from '../hooks/useAuth';
import Button from '../components/common/Button';

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


const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login } = useAppContext();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const { token: authToken, user } = await authService.resetPassword(token, password);
            setMessage('Password reset successfully! Logging you in...');

            await login(user.email, password);

            navigate('/dashboard', { replace: true });

        } catch (err) {
            setError(err?.message || 'Failed to reset password. Token might be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 isolate">
            <div
                className="fixed inset-0 w-full h-full object-cover -z-10 bg-cover bg-center opacity-25"
                style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
                aria-hidden="true"
            />
            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-8">
                <h2 className="text-center text-3xl font-extrabold text-text-primary">Reset Your Password</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {message && <p className="text-green-400 text-center">{message}</p>}

                    <FormInput id="password" label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    <FormInput id="confirmPassword" label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />

                    <Button type="submit" isLoading={isLoading} disabled={!!message}>
                        {message ? 'Done!' : 'Reset Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;