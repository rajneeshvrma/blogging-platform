import { Link } from 'react-router-dom';

const FeaturedPostCard = ({ post }) => {
  const createSnippet = (html, length) => {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden group">
      <Link to={`/post/${post._id}`}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            {post.image ? (
              <img src={post.image} alt={post.title} className="w-full h-full object-cover min-h-[250px]" />
            ) : (
              <div className="w-full h-full bg-gray-200 min-h-[250px]"></div>
            )}
          </div>
          <div className="p-8 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-2">
              By {post.user?.name || 'Unknown Author'} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {createSnippet(post.content, 150)}
            </p>
            <span className="font-semibold text-blue-600 inline-flex items-center">
              Continue Reading
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default FeaturedPostCard;