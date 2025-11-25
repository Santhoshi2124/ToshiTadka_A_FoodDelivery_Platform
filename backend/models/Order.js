import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // The user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The restaurant the order is from
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    // An array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        // Reference to the specific menu item
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'MenuItem',
        },
      },
    ],
    // Shipping address for the order
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    // The total price for the order
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Payment status
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    // Delivery status
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    // Automatically create `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
