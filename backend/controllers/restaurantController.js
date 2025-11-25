 import Restaurant from '../models/Restaurant.js';

// @desc    Get all restaurants, with optional search
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    // Check for a 'keyword' query parameter
    const keyword = req.query.keyword
      ? {
          // Search in both name and cuisine fields, case-insensitively
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { cuisine: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {}; // If no keyword, the filter is empty

    const restaurants = await Restaurant.find({ ...keyword });
    res.json(restaurants);
  } catch (error) {
    console.error('ERROR FETCHING RESTAURANTS:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private
const createRestaurant = async (req, res) => {
  const { name, cuisine, address, imageUrl } = req.body;

  if (!name || !cuisine || !address) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  try {
    const restaurant = new Restaurant({
      name,
      cuisine,
      address,
      imageUrl,
      owner: req.user._id, // Assign the logged-in user as the owner
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error('ERROR CREATING RESTAURANT:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('ERROR FETCHING RESTAURANT BY ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getAllRestaurants, createRestaurant, getRestaurantById };

