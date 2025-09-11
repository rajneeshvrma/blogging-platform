import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../api/authService';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        return data;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };
    
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = { user, isAuthenticated: !!user, loading, login, register, logout, theme, toggleTheme };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
};

// Export the useAppContext hook so it can be used in other components.
export const useAppContext = () => {
  return useContext(AppContext);
};