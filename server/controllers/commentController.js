import Comment from '../models/Comment.js';
import Post from '../models/Post.js'; 
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 

export const createComment = asyncHandler(async (req, res) => {
  const { text, postId } = req.body;

  
  if (!text || !postId) {
    res.status(400);
    throw new Error('Post ID and comment text are required');
  }

  
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(404);
    throw new Error('Post not found (Invalid ID)');
  }

  
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  
  const comment = new Comment({
    text,
    post: postId, 
    user: req.user._id, 
  });

  const createdComment = await comment.save();

  
  try {
    
    post.comments.push(createdComment._id);
    await post.save(); 
    console.log(`[commentController.js] Added comment ${createdComment._id} to post ${postId}`);
  } catch (updateError) {
      
      
      console.error(`[commentController.js] Failed to add comment ref to post ${postId}:`, updateError);
      
      
      
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
        res.status(404);
        throw new Error('Post not found (Invalid ID)');
    }
    const comments = await Comment.find({ post: req.params.postId })
                                  .populate('user', 'name avatar _id')
                                  .sort({ createdAt: -1 });
    res.json(comments);
});