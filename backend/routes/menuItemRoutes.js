import express from 'express';
const router = express.Router();
import { addMenuItem, getMenuItemsByRestaurant } from '../controllers/menuItemController.js';
import { protect } from '../middleware/authMiddleware.js';

// The ":restaurantId" is a URL parameter that lets us know which restaurant
// we're dealing with.

// Route to get all menu items for a restaurant (Public)
router.route('/:restaurantId').get(getMenuItemsByRestaurant);

// Route to add a new menu item to a restaurant (Private)
router.route('/:restaurantId').post(protect, addMenuItem);

export default router;
