import axios from 'axios';

const getToken = () => sessionStorage.getItem('token');

const getAuthConfig = () => {
    const token = getToken();
    if (!token) {
        console.error("No token available for API call");
        throw new Error("Authentication required");
    }
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const commentService = {
    addComment: async (postId, text) => {
        const config = getAuthConfig();
        try {
            const { data } = await axios.post('/api/comments', { postId, text }, config);
            return {
                ...data,
                id: data._id,
                user: {
                    ...(data.user || {}),
                    id: data.user?._id
                }
            };
        } catch (error) {
            console.error(`commentService.addComment: Failed for post ${postId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getComments: async (postId) => {
        try {
            const { data } = await axios.get(`/api/comments/${postId}`);
            return data.map(comment => ({
                ...comment,
                id: comment._id,
                user: {
                    id: comment.user?._id,
                    name: comment.user?.name || 'Unknown User',
                    avatar: comment.user?.avatar || `https://placehold.net/avatar-4.svg`
                }
            }));
        } catch (error) {
            console.error(`Failed to fetch comments for post ${postId}:`, error.response?.data?.message || error.message);
            return [];
        }
    },

    updateComment: async (commentId, text) => {
        const config = getAuthConfig(); 
        try {
            const { data } = await axios.put(`/api/comments/${commentId}`, { text }, config);
            return {
                ...data,
                id: data._id,
                user: {
                    ...(data.user || {}),
                    id: data.user?._id
                }
            };
        } catch (error) {
            console.error(`commentService.updateComment: Failed for comment ${commentId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        const config = getAuthConfig();
        try {
            const { data } = await axios.delete(`/api/comments/${commentId}`, config);
            return data; 
        } catch (error) {
            console.error(`commentService.deleteComment: Failed for comment ${commentId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};