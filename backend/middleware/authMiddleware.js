import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Strict protection: User MUST be logged in.
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- THIS IS THE NEW FUNCTION ---
// Optional protection: If a user is logged in, it adds their data to the request.
// If they are not logged in, it simply continues without causing an error.
const protectOptional = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // If token is invalid, we don't need to throw an error, just proceed as a guest.
      console.log('Optional auth: Invalid token, proceeding as guest.');
    }
  }
  
  // Continue to the next step regardless of whether a user was found
  next();
};

export { protect, protectOptional };

