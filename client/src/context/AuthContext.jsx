import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { authService } from '../api/authService';
import { generateDummyBlogs } from '../data/dummyData';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setPosts(generateDummyBlogs(50));

        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            if (storedToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        }
        
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        setLoading(false);
    }, []);

    const updateUserAndStorage = (newUserData) => {
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...newUserData };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const addPost = (postData) => {
        const currentUserId = user?.id || user?._id; 
        const author = {
            id: currentUserId, 
            name: user.name,
            avatar: user.avatar || `https://i.pravatar.cc/150?u=${currentUserId}`,
        };

        if (postData.id) { 
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postData.id
                    ? { ...post, ...postData, author: post.author }
                    : post
                )
            );
        } else { 
            const newPost = {
                ...postData,
                id: Date.now(),
                author: author,
                likes: [],
                comments: [],
                timestamp: new Date().toISOString(),
                status: postData.status || 'published',
                publishedAt: postData.publishedAt || new Date(),
            };
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
    };

    const deletePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };

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

    const value = { user, setUser: updateUserAndStorage, isAuthenticated: !!user, loading, login, register, logout, theme, toggleTheme, posts, addPost, deletePost };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
};