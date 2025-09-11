// Helper function to simulate API delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// MOCK_POSTS will be mutable, so it's defined outside the service.
const MOCK_POSTS = [
    {
        id: 1,
        title: "Exploring the Wonders of the Cosmos",
        slug: "exploring-the-wonders-of-the-cosmos",
        content: "<p>The universe is a vast and mysterious place, filled with galaxies, stars, and planets. For centuries, humans have looked up at the night sky and wondered about our place in it all. Modern astronomy has unveiled incredible details about distant galaxies and the life cycle of stars. Technologies like the James Webb Space Telescope are pushing the boundaries of our knowledge even further, revealing the universe's earliest moments.</p><p>From the fiery birth of stars to the silent dance of galaxies, every cosmic event tells a story of immense scale and beauty. Studying the cosmos not only helps us understand the laws of physics but also inspires a sense of awe and wonder.</p>",
        author: "Dr. Evelyn Reed",
        authorId: 101,
        createdAt: "2024-08-15T10:30:00Z",
        featured: true,
        imageUrl: `https://placehold.co/800x400/0D1B2A/E0E1DD?text=Cosmos`
    },
    {
        id: 2,
        title: "The Art of Minimalist Web Design",
        slug: "the-art-of-minimalist-web-design",
        content: "<p>Minimalism in web design is about more than just using whitespace; it's a philosophy of 'less is more'. By removing unnecessary elements, designers can create a more focused and intuitive user experience. This approach prioritizes content and functionality, ensuring that users can achieve their goals without distraction.</p><p>Key principles include a limited color palette, clean typography, and a strong grid system. When executed well, minimalist design is not only beautiful but also highly effective, leading to faster load times and better usability across all devices.</p>",
        author: "Alex Chen",
        authorId: 102,
        createdAt: "2024-08-14T14:00:00Z",
        featured: false,
        imageUrl: `https://placehold.co/800x400/415A77/E0E1DD?text=Minimalism`
    },
    {
        id: 3,
        title: "A Deep Dive into Sustainable Living",
        slug: "a-deep-dive-into-sustainable-living",
        content: "<p>Sustainable living is a lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources. It's about making choices that are better for the environment and for future generations. This can range from simple actions like recycling and reducing waste to larger commitments like using renewable energy and supporting local, sustainable agriculture.</p><p>The goal is to create a balance between our needs and the planet's ability to provide. Every small change contributes to a larger, positive impact, fostering a healthier planet and a more conscious community.</p>",
        author: "Jasmine Kaur",
        authorId: 103,
        createdAt: "2024-08-12T09:00:00Z",
        featured: false,
        imageUrl: `https://placehold.co/800x400/778DA9/E0E1DD?text=Sustainability`
    }
];

export const postService = {
    getPosts: async () => {
        await sleep(500);
        return [...MOCK_POSTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getPostBySlug: async (slug) => {
        await sleep(300);
        return MOCK_POSTS.find(p => p.slug === slug) || null;
    },
    createPost: async (postData) => {
        await sleep(500);
        const newPost = {
            ...postData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            imageUrl: `https://placehold.co/800x400/1B263B/E0E1DD?text=New+Post`
        };
        MOCK_POSTS.unshift(newPost);
        return newPost;
    }
};