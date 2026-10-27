import express from 'express';
import { getPestAlerts, createPestAlert } from '../controllers/pestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPestAlerts).post(protect, authorize('admin', 'expert'), createPestAlert);

export default router;
