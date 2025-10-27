import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePostDetails,
  deletePost,
  getPostsByUser,
  likePost,
  unlikePost,
  getMyPosts,
} from '../controllers/postController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/myposts').get(protect, getMyPosts);
// ---------------------------------

router.route('/:id').get(getPostById).put(protect, updatePostDetails).delete(protect, deletePost);
router.route('/user/:userId').get(getPostsByUser);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/unlike').put(protect, unlikePost);

export default router;