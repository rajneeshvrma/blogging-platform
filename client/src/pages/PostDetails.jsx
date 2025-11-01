import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${id}`);
        const data = await res.json();

        if (res.ok) {
          setPost(data);
        } else {
          console.error("Error fetching post:", data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!post) return <div className="text-center mt-10 text-lg">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 pt-28">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
        <span>By {post.author?.name || 'Unknown'}</span>
        <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <img
        className="w-full h-auto max-h-96 object-cover rounded-lg mb-8"
        src={post.imageUrl || 'https://placehold.co/800x400/1B263B/E0E1DD?text=GlassBlog%0ANo+Image'}
        alt={post.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/800x400/1B263B/E0E1DD?text=Image+Error';
        }}
      />

      <div
        className="prose prose-invert prose-lg max-w-none text-text-secondary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </div>
  );
};

export default PostDetailsPage;
