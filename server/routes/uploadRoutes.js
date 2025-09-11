import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: req.file.path, // The secure URL from Cloudinary
    });
  } else {
    res.status(400).send({ message: 'No image file provided' });
  }
});

export default router;