import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserById, 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

  router.route('/:id').get(protect, getUserById); 

export default router;