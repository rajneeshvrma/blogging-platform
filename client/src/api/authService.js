import axios from 'axios';

// This is the updated authentication service that connects to your real backend
export const authService = {
    login: async (email, password) => {
        // Sending a POST request to the backend login endpoint
        const { data } = await axios.post('/api/auth/login', { email, password });
        
        // The backend will return user data and a token
        if (data) {
            // We rename '_id' to 'id' to maintain consistency with frontend code
            const user = { ...data, id: data._id };
            return { token: data.token, user };
        }
        throw new Error("Login failed. Please check your credentials.");
    },

    register: async (name, email, password) => {
        // This function now correctly calls your backend registration endpoint
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        
        if (data) {
            const user = { ...data, id: data._id };
            return { token: data.token, user };
        }
        throw new Error("Registration failed. Please try again.");
    }
};