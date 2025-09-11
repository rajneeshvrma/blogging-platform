import express from 'express';
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCategory) // Only logged-in admins can create
  .get(getCategories);                   // Anyone can get the list

export default router;