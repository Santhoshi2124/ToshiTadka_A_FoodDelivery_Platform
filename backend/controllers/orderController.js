import Order from '../models/Order.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    totalPrice,
    restaurant,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      orderItems: orderItems.map(item => ({ ...item, product: item._id })),
      user: req.user._id,
      restaurant,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('ERROR CREATING ORDER:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // req.user._id comes from the 'protect' middleware
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('ERROR FETCHING USER ORDERS:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { addOrderItems, getMyOrders };

