import axios from 'axios';

// This service now makes real API calls to your backend for posts

export const postService = {
    // Get all posts
    getPosts: async () => {
        try {
            const { data } = await axios.get('/api/posts');
            // IMPORTANT: Map backend's '_id' to frontend's 'id'
            return data.map(post => ({ ...post, id: post._id }));
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            return []; // Return an empty array on error
        }
    },

    // Get a single post by its ID
    getPostById: async (id) => {
        try {
            const { data } = await axios.get(`/api/posts/${id}`);
            return { ...data, id: data._id };
        } catch (error) {
            console.error(`Failed to fetch post ${id}:`, error);
            return null;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            // The AuthContext will automatically add the token to the header
            const { data } = await axios.post('/api/posts', postData);
            return { ...data, id: data._id };
        } catch (error) {
            console.error("Failed to create post:", error);
            throw error; // Throw error to be handled by the component
        }
    }
};