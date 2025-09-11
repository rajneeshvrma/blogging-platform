export const CURRENT_USER_ID = 101;

export const ALL_USERS = Array.from({ length: 15 }, (_, i) => ({
    id: 100 + i, name: `User ${100 + i}`, avatar: `https://i.pravatar.cc/150?u=${100 + i}`,
    coverPhoto: `https://picsum.photos/1000/300?random=${100 + i}`, bio: `This is the bio for User ${100 + i}.`,
    followers: Array.from({length: Math.floor(Math.random() * 20)}, (_, k) => 100 + k),
    following: Array.from({length: Math.floor(Math.random() * 10)}, (_, k) => 100 + k + 5)
}));

export const generateDummyBlogs = (count) => Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    author: ALL_USERS[i % ALL_USERS.length],
    title: `Glassmorphism in UI Design ${i + 1}`,
    content: `This is the content for blog post number ${i + 1}. Glassmorphism is a new UI trend that uses transparency, blur, and light borders to create a "frosted glass" effect. It gives a modern and futuristic look. It's easy to integrate into design systems and gives apps a premium feel. Implementing it with React components is even easier. Tailwind CSS's backdrop-blur utility classes are perfect for this. You just need to add transparency to your background color.`,
    imageUrl: `https://picsum.photos/800/400?random=${i + 1}`,
    likes: Array.from({ length: Math.floor(Math.random() * 25) }, (_, k) => ({ id: 100 + k, name: `User ${100 + k}` })),
    comments: [{ id: 301, user: { id: 201, name: 'Commenter 1' }, text: 'Wow, amazing design!' }, { id: 302, user: { id: 202, name: 'Commenter 2' }, text: 'Thanks for sharing.' }],
    timestamp: new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 24).toISOString(),
}));