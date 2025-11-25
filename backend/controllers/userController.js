// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// // ... registerUser function is the same ...

// // @desc    Auth user & get token (Login)
// // @route   POST /api/users/login
// // @access  Public
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '30d',
//       });

//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: token,
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     // --- THIS IS THE IMPORTANT CHANGE ---
//     // We are now logging the full error to the backend console
//     console.error('--- LOGIN FAILED ---');
//     console.error(error); // This will show the exact reason for the crash.
//     console.error('--------------------');
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Register a new user
// // @route   POST /api/users/register
// // @access  Public
// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     if (user) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '30d',
//       });

//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: token,
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     console.error('--- REGISTRATION FAILED ---');
//     console.error(error);
//     console.error('---------------------------');
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export { registerUser, loginUser };

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // --- THIS IS THE FIX (Part 1) ---
    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists, send a 400 Bad Request error
      return res.status(400).json({ message: 'User already exists' });
    }

    // If user does not exist, create a new user
    const user = await User.create({
      name,
      email,
      password, // The hashing happens automatically from the User model
    });

    if (user) {
      // If user was created successfully, generate a token and send back the user data
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // --- THIS IS THE FIX (Part 2) ---
    // Add detailed error logging to see any other potential errors
    console.error('ERROR REGISTERING USER:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('--- LOGIN FAILED ---');
    console.error(error);
    console.error('--------------------');
    res.status(500).json({ message: 'Server Error' });
  }
};

export { registerUser, loginUser };

