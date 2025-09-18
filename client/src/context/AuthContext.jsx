import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios'; // Import axios
import { authService } from '../api/authService';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            // Set the token for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { token, user } = await authService.login(email, password);
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { token, user };
    };

    const register = async (name, email, password) => {
        const { token, user } = await authService.register(name, email, password);
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { token, user };
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };
    
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = { user, setUser, isAuthenticated: !!user, loading, login, register, logout, theme, toggleTheme };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
};