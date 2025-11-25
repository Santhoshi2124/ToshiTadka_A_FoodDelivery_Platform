import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// --- THIS IS THE FIX ---
// Load environment variables at the very beginning
dotenv.config();

// Import All Routes
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/AiApiRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connection established successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// Use All Routes
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the ToshiTadka Backend API!" });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

