import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Note: The route to get comments is associated with a post ID
router.route('/:postId').get(getCommentsByPostId);
router.route('/').post(protect, createComment);

export default router;