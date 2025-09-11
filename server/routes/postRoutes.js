import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost, // Add this
  deletePost,
  likePost,   // Add this
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost) // Add this
  .delete(protect, deletePost);

router.route('/:id/like').put(protect, likePost); // Add this

export default router;