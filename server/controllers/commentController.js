import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

export const createComment = asyncHandler(async (req, res) => {
  const { text, postId } = req.body;
  if (!text || !postId) { res.status(400); throw new Error('Post ID and comment text are required'); }
  if (!mongoose.Types.ObjectId.isValid(postId)) { res.status(404); throw new Error('Post not found (Invalid ID)'); }
  const post = await Post.findById(postId);
  if (!post) { res.status(404); throw new Error('Post not found'); }
  if (!req.user || !req.user._id) { res.status(401); throw new Error('User not authenticated'); }

  const comment = new Comment({ text, post: postId, user: req.user._id });
  const createdComment = await comment.save();

  try {
    post.comments.push(createdComment._id);
    await post.save();
    console.log(`[commentController.js] Added comment ${createdComment._id} to post ${postId}`);
  } catch (updateError) {
      console.error(`[commentController.js] Failed to add comment ref to post ${postId}:`, updateError);
      await Comment.findByIdAndDelete(createdComment._id);
      throw new Error('Failed to link comment to post');
  }

  const populatedComment = await Comment.findById(createdComment._id)
                                        .populate('user', 'name avatar _id');
  if (!populatedComment) {
       console.error(`[commentController.js] Failed to populate comment ${createdComment._id} after creation.`);
       return res.status(201).json(createdComment);
  }
  res.status(201).json(populatedComment);
});

export const getCommentsByPostId = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        res.status(404); throw new Error('Post not found (Invalid ID)');
    }
    const comments = await Comment.find({ post: req.params.postId })
                                  .populate('user', 'name avatar _id')
                                  .sort({ createdAt: -1 });
    res.json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const commentId = req.params.id;

    if (!text) {
        res.status(400);
        throw new Error('Comment text cannot be empty');
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(404);
        throw new Error('Comment not found (Invalid ID)');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    
    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this comment');
    }

    comment.text = text;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
                                          .populate('user', 'name avatar _id');

    res.json(populatedComment || updatedComment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(404);
        throw new Error('Comment not found (Invalid ID)');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(401); 
        throw new Error('User not authorized to delete this comment');
    }

    const postId = comment.post; 

    await comment.deleteOne(); 

    try {
        await Post.findByIdAndUpdate(postId, {
            $pull: { comments: commentId }
        });
        console.log(`[commentController.js] Removed comment ref ${commentId} from post ${postId}`);
    } catch (postUpdateError) {
        console.error(`[commentController.js] Failed to remove comment ref from post ${postId}:`, postUpdateError);
    }

    res.json({ message: 'Comment removed successfully' });
});