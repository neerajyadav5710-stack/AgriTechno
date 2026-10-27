import express from 'express';
import { getResources, getResourceById, createResource } from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getResources).post(protect, authorize('admin', 'expert'), createResource);
router.route('/:id').get(getResourceById);

export default router;
