import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: storage });

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: req.file.path, 
    });
  } else {
    res.status(400).send({ message: 'No image file provided or invalid file type' });
  }
});

export default router;