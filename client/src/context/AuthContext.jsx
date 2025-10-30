import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { authService } from '../api/authService';
import { postService } from '../api/postService';
import { userService } from '../api/userService';
import Spinner from '../components/common/Spinner';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [posts, setPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const fetchPosts = async (currentAllUsers = allUsers) => {
        try {
            const fetchedPosts = await postService.getPosts();
            const processedPosts = fetchedPosts.map(post => {
                let authorData = { id: null, name: 'Unknown Author', avatar: 'https://i.pravatar.cc/150?u=default' };
                if (post.author) {
                    let authorId = null;
                    let authorDetails = null;
                    if (typeof post.author === 'object' && post.author !== null) {
                        authorId = post.author._id || post.author.id;
                        authorDetails = post.author;
                    } else if (typeof post.author === 'string') {
                        authorId = post.author;
                        authorDetails = currentAllUsers.find(u => u._id === authorId || u.id === authorId);
                    }
                    if (authorId) {
                        authorData.id = authorId;
                        authorData.name = authorDetails?.name || `User ${authorId.slice(-4)}`;
                        authorData.avatar = authorDetails?.avatar || `https://placehold.net/avatar-4.svg`;
                    } else {
                    }
                }
                const processedComments = Array.isArray(post.comments) ? post.comments.map(c => ({
                    ...(c || {}), id: c?._id || c?.id, user: c?.user ? { ...(c.user || {}), id: c.user._id || c.user.id } : { name: 'User', id: null }
                })) : [];
                return { ...post, id: post._id || post.id, author: authorData, comments: processedComments };
            });
            setPosts(processedPosts);
        } catch (error) { console.error("AuthContext: Error fetching posts:", error); setPosts([]); }
    };

    const fetchAllUsers = async () => {
        try {
            const users = await userService.getAllUsers();
            const mappedUsers = users.map(u => ({ ...u, id: u._id || u.id }));
            setAllUsers(mappedUsers);
            return mappedUsers;
        } catch (error) { console.error("AuthContext: Error fetching users:", error); setAllUsers([]); return []; }
    };

     useEffect(() => {
         const initialize = async () => {
             setLoading(true);
             const storedUser = sessionStorage.getItem('user');
             const storedToken = sessionStorage.getItem('token');
             let initialUser = null;
             let fetchedUsers = [];
             if (storedUser && storedToken) {
                 try {
                     initialUser = JSON.parse(storedUser);
                     setUser(initialUser);
                     axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                     fetchedUsers = await fetchAllUsers();
                 } catch (e) { console.error("AuthContext: Error initializing user/users:", e); sessionStorage.clear(); setUser(null); delete axios.defaults.headers.common['Authorization']; }
             }
             const storedTheme = localStorage.getItem('theme') || 'dark';
             setTheme(storedTheme);
             try { await fetchPosts(fetchedUsers); }
             catch (postError) { console.error("AuthContext: Initial post fetch failed:", postError); }
             setLoading(false);
         };
         initialize();
     }, []);

    const updateUserAndStorage = (newUserData) => {
        setUser(prevUser => {
            const mappedUserData = { ...newUserData, id: newUserData._id || newUserData.id };
            const updatedUser = { ...prevUser, ...mappedUserData };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const addPost = async (postData) => {
        const isEditing = !!postData.id || !!postData._id;
        const postId = postData.id || postData._id;
        try {
            let savedPost;
            if (isEditing && postId) { savedPost = await postService.updatePost(postId, postData); }
            else { savedPost = await postService.createPost(postData); }
           await fetchPosts();
           return savedPost;
        } catch (error) { console.error("Failed to save post:", error); throw error; }
    };
    const deletePost = async (postId) => {
         try {
             await postService.deletePost(postId);
             await fetchPosts();
         } catch (error) {
             console.error("Failed to delete post:", error);
             throw error;
         }
     };

    const updatePostState = (updatedPostData) => {
        const processedPost = {
            ...updatedPostData,
            id: updatedPostData._id || updatedPostData.id,
            author: {
                id: updatedPostData.author?._id || updatedPostData.author?.id,
                name: updatedPostData.author?.name || 'Unknown Author',
                avatar: updatedPostData.author?.avatar || `https://placehold.net/avatar-4.svg'}`
            },
            comments: Array.isArray(updatedPostData.comments) ? updatedPostData.comments.map(comment => ({
                ...(comment || {}),
                id: comment?._id || comment?.id,
                user: comment?.user ? {
                    ...(comment.user || {}),
                    id: comment.user._id || comment.user.id
                } : { name: 'User', id: null, avatar: '' }
            })) : []
        };
        setPosts(prevPosts =>
            prevPosts.map(post => ((post.id || post._id) === processedPost.id) ? processedPost : post)
        );
    };


    const login = async (email, password) => {
        try {
            const { token, user: loggedInUser } = await authService.login(email, password);
            const mappedUser = { ...loggedInUser, id: loggedInUser._id };
            setUser(mappedUser);
            sessionStorage.setItem('user', JSON.stringify(mappedUser));
            sessionStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setLoading(true);
            const users = await fetchAllUsers();
            await fetchPosts(users);
            setLoading(false);
            return { token, user: mappedUser };
        } catch (error) { console.error("Login failed:", error); setLoading(false); throw error; }
    };

    const register = async (name, email, password) => {
        try {
            const { token, user: registeredUser } = await authService.register(name, email, password);
            const mappedUser = { ...registeredUser, id: registeredUser._id };
            setUser(mappedUser);
            sessionStorage.setItem('user', JSON.stringify(mappedUser));
            sessionStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setLoading(true);
            const users = await fetchAllUsers();
            await fetchPosts(users);
            setLoading(false);
            return { token, user: mappedUser };
        } catch (error) { console.error("Registration failed:", error); setLoading(false); throw error; }
    };

    const logout = () => {
        setUser(null);
        setPosts([]);
        setAllUsers([]);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = {
        user,
        setUser: updateUserAndStorage,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        theme,
        toggleTheme,
        posts,
        addPost,
        deletePost,
        allUsers,
        updatePostState,
        fetchPosts
    };

    return (
        <AppContext.Provider value={value}>
            {loading ? (
                <div className="flex justify-center items-center h-screen bg-background">
                    <Spinner />
                </div>
            ) : (
                children
            )}
        </AppContext.Provider>
    );
};