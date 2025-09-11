// import { Link } from 'react-router-dom';

// const Sidebar = ({ categories, activeCategory, onCategorySelect, popularPosts }) => {
//   return (
//     <div className="space-y-8">
//       {/* Categories Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-xl font-bold mb-4 border-b pb-2">Categories</h3>
//         <ul className="space-y-2">
//           {categories.map(category => (
//             <li key={category}>
//               <button
//                 onClick={() => onCategorySelect(category)}
//                 className={`w-full text-left capitalize px-2 py-1 rounded transition ${
//                   activeCategory === category
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 {category}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Popular Posts Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-xl font-bold mb-4 border-b pb-2">Popular Posts</h3>
//         <ul className="space-y-4">
//           {popularPosts.map(post => (
//             <li key={post._id} className="flex items-center gap-4">
//               {post.image && (
//                 <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-md" />
//               )}
//               <div>
//                 <Link to={`/post/${post._id}`} className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
//                   {post.title}
//                 </Link>
//                 <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;