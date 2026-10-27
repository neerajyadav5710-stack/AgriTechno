import express from 'express';
import { getConsultations, createConsultation, respondToConsultation } from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getConsultations).post(protect, createConsultation);
router.route('/:id/respond').post(protect, respondToConsultation);

export default router;
