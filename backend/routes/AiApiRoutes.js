import express from 'express';
const router = express.Router();
import { solveCraving, chatWithBot } from '../controllers/AiSearchController.js';
// Import the new optional middleware
import { protectOptional } from '../middleware/authMiddleware.js';

// GET /api/ai/solve-craving -> AI craving solver (public)
router.route('/solve-craving').get(solveCraving);

// POST /api/ai/chat -> Conversational chatbot (now optionally protected)
// We use the new middleware to allow guests to chat
router.route('/chat').post(protectOptional, chatWithBot);

export default router;

