import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

// When a POST request is made to '/register', the registerUser function will run.
router.post('/register', registerUser);
router.post('/login', loginUser);
export default router;
