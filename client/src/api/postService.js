import axios from 'axios';

const getToken = () => sessionStorage.getItem('token');

const getAuthConfig = () => {
    const token = getToken();
    if (!token) {
        console.error("No token available for API call");
        return null;
    }
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const postService = {
    getPosts: async () => {
        try {
            const { data } = await axios.get('/api/posts');
             return data.map(post => ({
                 ...post,
                 id: post._id,
                 author: {
                     id: post.author?._id || post.author, 
                     name: post.author?.name || 'Unknown Author',
                     avatar: post.author?.avatar || `https://i.pravatar.cc/150?u=${post.author?._id || post.author || 'default'}`
                 }
             }));
        } catch (error) {
            console.error("Failed to fetch posts:", error.response?.data?.message || error.message);
            return [];
        }
    },

    getPostById: async (id) => {
        const config = getAuthConfig();
         if (!config) return null;
        try {
            const { data } = await axios.get(`/api/posts/${id}`, config);
            console.log(`postService.getPostById (${id}) - Raw response data:`, data);

            const postResult = {
                ...data, 
                id: data._id,
                author: { 
                    id: data.author?._id || data.author?.id,
                    name: data.author?.name || 'Unknown Author',
                    avatar: data.author?.avatar || `https://i.pravatar.cc/150?u=${data.author?._id || data.author?.id || 'default'}`
                },
                comments: Array.isArray(data.comments) ? data.comments.map(c => ({
                    ...(c || {}), 
                    id: c?._id || c?.id, 
                    user: c?.user ? { 
                        ...(c.user || {}), 
                        id: c.user._id || c.user.id 
                    } : { name: 'User', id: null } 
                })) : [] 
             };
             console.log(`postService.getPostById (${id}) - Mapped result:`, postResult);
            return postResult;
        } catch (error) {
            console.error(`Failed to fetch post ${id}:`, error.response?.data?.message || error.message);
            return null;
        }
    },

    createPost: async (postData) => {
         const config = getAuthConfig();
         if (!config) throw new Error("Authentication required");
         const { id, ...payload } = postData;
        try {
             const { data } = await axios.post('/api/posts', payload, config);
             return { 
                 ...data,
                 id: data._id,
                 author: {
                     id: data.author?._id || data.author?.id,
                     name: data.author?.name || 'Unknown Author',
                     avatar: data.author?.avatar || `https://i.pravatar.cc/150?u=${data.author?._id || data.author?.id || 'default'}`
                 },
                 comments: data.comments || [], 
                 likes: data.likes || [] 
            };
        } catch (error) {
            console.error("Failed to create post:", error.response?.data?.message || error.message);
            throw error;
        }
    },

     updatePost: async (postId, postData) => {
         const config = getAuthConfig();
         if (!config) throw new Error("Authentication required");
         const { id, _id, ...payload } = postData;
         try {
             const { data } = await axios.put(`/api/posts/${postId}`, payload, config);
             return { 
                 ...data,
                 id: data._id,
                 author: {
                     id: data.author?._id || data.author?.id,
                     name: data.author?.name || 'Unknown Author',
                     avatar: data.author?.avatar || `https://i.pravatar.cc/150?u=${data.author?._id || data.author?.id || 'default'}`
                 },
                 comments: data.comments || [],
                 likes: data.likes || []
             };
         } catch (error) {
             console.error(`Failed to update post ${postId}:`, error.response?.data?.message || error.message);
             throw error;
         }
     },

     deletePost: async (postId) => {
         const config = getAuthConfig();
         if (!config) throw new Error("Authentication required");
         try {
             await axios.delete(`/api/posts/${postId}`, config);
             return { message: 'Post deleted successfully' };
         } catch (error) {
             console.error(`Failed to delete post ${postId}:`, error.response?.data?.message || error.message);
             throw error;
         }
     },

    likePost: async (postId) => {
        const config = getAuthConfig();
        if (!config) throw new Error("Authentication required");
        try {
            const { data } = await axios.put(`/api/posts/${postId}/like`, {}, config);
            return data; 
        } catch (error) {
            console.error(`Failed to like post ${postId}:`, error.response?.data?.message || error.message);
            throw error;
        }
    },

    unlikePost: async (postId) => {
        const config = getAuthConfig();
        if (!config) throw new Error("Authentication required");
        try {
            const { data } = await axios.put(`/api/posts/${postId}/unlike`, {}, config);
            return data; 
        } catch (error) {
            console.error(`Failed to unlike post ${postId}:`, error.response?.data?.message || error.message);
            throw error;
        }
    },

    addComment: async (postId, text) => {
        const config = getAuthConfig();
        if (!config) throw new Error("Authentication required to comment.");
        console.log(`postService.addComment: Posting to /api/comments`, { postId, text });
        try {
            const { data } = await axios.post('/api/comments', { postId, text }, config);
            console.log(`postService.addComment: Response data:`, data);
            return {
                ...data,
                id: data._id,
                user: {
                    ...data.user,
                    id: data.user._id
                }
            };
        } catch (error) {
            console.error(`postService.addComment: Failed for post ${postId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getComments: async (postId) => {
        const config = getAuthConfig();
        if (!config) return [];
        try {
            const { data } = await axios.get(`/api/comments/${postId}`, config);
            return data.map(comment => ({
                ...comment,
                id: comment._id,
                user: {
                    id: comment.user?._id,
                    name: comment.user?.name || 'Unknown User',
                    avatar: comment.user?.avatar || `https://i.pravatar.cc/150?u=${comment.user?._id || 'default'}`
                }
            }));
        } catch (error) {
            console.error(`Failed to fetch comments for post ${postId}:`, error.response?.data?.message || error.message);
            return [];
        }
    }
};