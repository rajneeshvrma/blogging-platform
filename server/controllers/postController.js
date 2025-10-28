import Post from '../models/Post.js';
import User from '../models/User.js';

import Comment from '../models/Comment.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .populate('author', 'name avatar _id') 
    .populate({ 
        path: 'comments',
        model: 'Comment',
        populate: { 
            path: 'user',
            model: 'User',
            select: 'name avatar _id'
        },
        options: { sort: { createdAt: -1 } } 
    })
    .sort({ publishedAt: -1 });
  res.json(posts);
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name avatar _id') 
    .populate({ 
        path: 'comments',
        model: 'Comment',
        populate: { 
            path: 'user',
            model: 'User',
            select: 'name avatar _id'
        },
        options: { sort: { createdAt: -1 } } 
    })
    .sort({ createdAt: -1 });
  res.json(posts);
});

export const getPostById = asyncHandler(async (req, res) => {
  
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404);
      throw new Error('Post not found (Invalid ID)');
  }

  
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar _id') 
    .populate({ 
        path: 'comments',
        populate: { 
            path: 'user',
            select: 'name avatar _id' 
        },
        options: { sort: { createdAt: -1 } } 
    });
  

  if (post) {
    
    if (
      post.status !== 'published' &&
      
      (!req.user || post.author._id.toString() !== req.user._id.toString())
    ) {
      res.status(404); 
      throw new Error('Post not found or not authorized');
    }
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});


export const createPost = asyncHandler(async (req, res) => {
  const { title, content, imageUrl, category, status, publishedAt } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  
  let finalPublishedAt;
  if (status === 'scheduled' && publishedAt) {
    finalPublishedAt = new Date(publishedAt);
  } else if (status === 'draft') {
    finalPublishedAt = null; 
  } else {
    
    finalPublishedAt = new Date();
  }


  const post = new Post({
    author: req.user._id,
    title,
    content,
    imageUrl,
    category: category || 'General',
    status: status || 'published',
    publishedAt: finalPublishedAt, 
  });

  const createdPost = await post.save();
  
  const populatedPost = await Post.findById(createdPost._id).populate('author', 'name avatar _id');
  res.status(201).json(populatedPost);
});

export const updatePostDetails = asyncHandler(async (req, res) => {
   
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       res.status(404);
       throw new Error('Post not found (Invalid ID)');
   }
  const { title, content, imageUrl, category, status, publishedAt } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  post.title = title !== undefined ? title : post.title;
  post.content = content !== undefined ? content : post.content;
  post.imageUrl = imageUrl !== undefined ? imageUrl : post.imageUrl;
  post.category = category !== undefined ? category : post.category;

  const previousStatus = post.status;
  post.status = status !== undefined ? status : post.status;

  
  if (status === 'scheduled' && publishedAt) {
      post.publishedAt = new Date(publishedAt);
  } else if (status === 'published' && previousStatus !== 'published') {
      
      post.publishedAt = post.publishedAt && post.publishedAt > new Date() ? post.publishedAt : new Date();
  } else if (status === 'draft') {
      post.publishedAt = null; 
  } else if (publishedAt) {
      
      post.publishedAt = new Date(publishedAt);
  }


  const updatedPost = await post.save();
  
  const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name avatar _id');
  res.json(populatedPost);
});

export const deletePost = asyncHandler(async (req, res) => {
   
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       res.status(404);
       throw new Error('Post not found (Invalid ID)');
   }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  
  await Comment.deleteMany({ post: post._id });

  await post.deleteOne();
  res.json({ message: 'Post and associated comments removed' });
});

export const getPostsByUser = asyncHandler(async (req, res) => {
   
   if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
       res.status(404);
       throw new Error('User not found (Invalid ID)');
   }
  const posts = await Post.find({
    author: req.params.userId,
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .populate('author', 'name avatar _id') 
    .sort({ publishedAt: -1 });
  res.json(posts);
});

export const likePost = asyncHandler(async (req, res) => {
   
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       res.status(404);
       throw new Error('Post not found (Invalid ID)');
   }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const userIdString = req.user._id.toString();
  const alreadyLiked = post.likes.some((like) => like.toString() === userIdString);

  if (alreadyLiked) {
    
    post.likes = post.likes.filter((like) => like.toString() !== userIdString);
    await post.save();
    
    const updatedPost = await Post.findById(req.params.id).select('likes'); 
    res.json({ likes: updatedPost.likes }); 
  } else {
    
    post.likes.push(req.user._id);
    await post.save();
    const updatedPost = await Post.findById(req.params.id).select('likes'); 
    res.json({ likes: updatedPost.likes }); 
  }
});


export const unlikePost = asyncHandler(async (req, res) => {
   
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       res.status(404);
       throw new Error('Post not found (Invalid ID)');
   }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const userIdString = req.user._id.toString();
  const isLiked = post.likes.some((like) => like.toString() === userIdString);

  if (!isLiked) {
     
     const updatedPost = await Post.findById(req.params.id).select('likes'); 
     res.json({ likes: updatedPost.likes }); 
  } else {
    
    post.likes = post.likes.filter((like) => like.toString() !== userIdString);
    await post.save();
    const updatedPost = await Post.findById(req.params.id).select('likes'); 
    res.json({ likes: updatedPost.likes }); 
  }
});