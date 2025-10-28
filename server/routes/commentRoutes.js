import express from 'express';
import {
    createComment,
    getCommentsByPostId,
    updateComment, 
    deleteComment  
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createComment);

router.route('/:postId').get(getCommentsByPostId); 
router.route('/:id')
    .put(protect, updateComment)  
    .delete(protect, deleteComment); 

export default router;