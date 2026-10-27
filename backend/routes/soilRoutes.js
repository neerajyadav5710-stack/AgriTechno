import express from 'express';
import { analyzeAndSaveSoil, getSoilRecords } from '../controllers/soilController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getSoilRecords);
router.route('/analyze').post(protect, analyzeAndSaveSoil);

export default router;
