import Post from '../models/Post.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';



export const getPosts = asyncHandler(async (req, res) => {
  
  const posts = await Post.find({
    status: 'published',
    publishedAt: { $lte: new Date() }, 
  })
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 }); 
  res.json(posts);
});



export const getMyPosts = asyncHandler(async (req, res) => {
  
  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 }); 
  res.json(posts);
});



export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    'author',
    'name avatar'
  );
  

  if (post) {
    
    if (
      post.status !== 'published' &&
      post.author._id.toString() !== req.user?._id.toString()
    ) {
      res.status(404);
      throw new Error('Post not found');
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

  const post = new Post({
    author: req.user._id,
    title,
    content,
    imageUrl,
    category: category || 'General',
    status: status || 'published', 
    publishedAt:
      status === 'scheduled' ? publishedAt : new Date(publishedAt || Date.now()),
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});



export const updatePostDetails = asyncHandler(async (req, res) => {
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

  post.title = title || post.title;
  post.content = content || post.content;
  post.imageUrl = imageUrl !== undefined ? imageUrl : post.imageUrl;
  post.category = category || post.category;
  post.status = status || post.status;

  if (publishedAt) {
    post.publishedAt = publishedAt;
  } else if (status === 'published' && post.status !== 'published') {
    post.publishedAt = new Date();
  }

  const updatedPost = await post.save();
  res.json(updatedPost);
});



export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  await post.deleteOne(); 
  res.json({ message: 'Post removed' });
});



export const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    author: req.params.userId,
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 });
  res.json(posts);
});



export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  
  if (post.likes.some((like) => like.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('Post already liked');
  }
  
  post.likes.push(req.user._id);
  await post.save();
  res.json({ message: 'Post liked' });
});



export const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  
  if (!post.likes.some((like) => like.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('Post not yet liked');
  }
  
  post.likes = post.likes.filter(
    (like) => like.toString() !== req.user._id.toString()
  );
  await post.save();
  res.json({ message: 'Post unliked' });
});

