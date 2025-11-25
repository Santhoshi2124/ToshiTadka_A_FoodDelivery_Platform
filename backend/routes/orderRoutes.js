import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/orders -> Create a new order
router.route('/').post(protect, addOrderItems);

// --- THIS IS THE FIX ---
// GET /api/orders/myorders -> Get user's order history
router.route('/myorders').get(protect, getMyOrders);

export default router;

