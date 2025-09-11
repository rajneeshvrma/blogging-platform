import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Create a new comment
export const createComment = async (req, res) => {
  const { text, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      text,
      post: postId,
      user: req.user._id,
    });

    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get comments for a post
export const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};