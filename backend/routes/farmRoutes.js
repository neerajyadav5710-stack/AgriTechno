import express from 'express';
import { getMyFarms, getFarmById, createFarm, updateTelemetry } from '../controllers/farmController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyFarms).post(protect, createFarm);
router.route('/:id').get(protect, getFarmById);
router.route('/:id/telemetry').post(protect, updateTelemetry);

export default router;
