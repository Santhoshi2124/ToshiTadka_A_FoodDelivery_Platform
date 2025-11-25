import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Add a new menu item to a restaurant
// @route   POST /api/menuitems/:restaurantId
// @access  Private/Owner
const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl } = req.body;
        const { restaurantId } = req.params;

        // Find the restaurant to make sure it exists
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if the logged-in user is the owner of the restaurant
        // req.user is from our `protect` middleware
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to add items to this restaurant' });
        }

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imageUrl: imageUrl || undefined,
            restaurant: restaurantId
        });

        const createdMenuItem = await menuItem.save();
        res.status(201).json(createdMenuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all menu items for a specific restaurant
// @route   GET /api/menuitems/:restaurantId
// @access  Public
const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menuItems = await MenuItem.find({ restaurant: restaurantId });

        if (!menuItems) {
            return res.status(404).json({ message: 'No menu items found for this restaurant' });
        }
        
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export { addMenuItem, getMenuItemsByRestaurant };
