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

export const userService = {
    getAllUsers: async () => {
        try {
            const config = getAuthConfig(); 
            const { data } = await axios.get('/api/users', config);
            return data.map(user => ({ ...user, id: user._id || user.id }));
        } catch (error) {
            console.error("Failed to fetch users:", error.response?.data?.message || error.message);
            return [];
        }
    },

    toggleFollow: async (userIdToToggle) => {
        try {
            const config = getAuthConfig(); 
            const { data } = await axios.put(`/api/users/${userIdToToggle}/togglefollow`, {}, config);
            return data.following;
        } catch (error) {
            console.error(`Failed to toggle follow for user ${userIdToToggle}:`, error.response?.data?.message || error.message);
            throw error;
        }
    }
    
};