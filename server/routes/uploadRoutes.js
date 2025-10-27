import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/uploads/${req.file.filename}`, 
    });
  } else {
    res.status(400).send({ message: 'No image file provided or invalid file type' });
  }
});

export default router;