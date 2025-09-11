import { ALL_USERS } from '../data/dummyData'; // 1. Import the full user list

// Helper function to simulate API delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    login: async (email, password) => {
        await sleep(500);
        
        // 2. Find the user in the complete ALL_USERS array
        // (Using a simplified check for this example)
        const user = ALL_USERS.find(u => u.name.toLowerCase() === email.toLowerCase() && password === 'password123');

        if (user) {
            // 3. Return the FULL user object
            return { token: "fake-jwt-token", user: user };
        }
        throw new Error("Invalid credentials. Hint: Use a name like 'User 101' and password 'password123'");
    },
    register: async (name, email, password) => {
        await sleep(500);
        // This part can be expanded later if needed
        if (ALL_USERS.some(u => u.email === email)) {
            throw new Error("User already exists");
        }
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            // Add default empty arrays to match the data structure
            followers: [], 
            following: [],
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            coverPhoto: `https://picsum.photos/1000/300?random=${Date.now()}`,
            bio: `This is a new user bio.`
        };
        ALL_USERS.push(newUser);
        return { token: "fake-jwt-token", user: newUser };
    }
};