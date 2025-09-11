import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // This will store the rich text (HTML) from the editor
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL to the image from Cloudinary
      required: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;