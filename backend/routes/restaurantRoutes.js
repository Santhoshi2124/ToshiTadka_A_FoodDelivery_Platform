import express from 'express';
const router = express.Router();
import {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById, // Import the new controller
} from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public route to get all restaurants
router.route('/').get(getAllRestaurants);

// Private route to create a restaurant
router.route('/').post(protect, createRestaurant);

// Public route to get a single restaurant by its ID
router.route('/:id').get(getRestaurantById); // Add the new route

export default router;
