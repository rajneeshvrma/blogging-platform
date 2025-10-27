import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String, 
      required: true,
    },
    
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'], 
      default: 'published', 
    },
    publishedAt: {
      type: Date,
      default: Date.now, 
    },
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;