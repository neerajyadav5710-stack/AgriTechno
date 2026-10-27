import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, placeOrder).get(protect, authorize('admin'), getAllOrders);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

export default router;
