import express from 'express';
import { getCrops, addCrop, updateCrop, deleteCrop } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCrops).post(protect, addCrop);
router.route('/:id').put(protect, updateCrop).delete(protect, deleteCrop);

export default router;
