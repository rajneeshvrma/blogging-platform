import axios from 'axios';

export const userService = {
    getAllUsers: async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                return [];
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get('/api/users', config);
            return data.map(user => ({ ...user, id: user._id }));
        } catch (error) {
            console.error("Failed to fetch users:", error.response?.data?.message || error.message);
            return []; 
        }
    }
};