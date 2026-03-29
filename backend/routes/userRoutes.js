import express from 'express';
import User from '../models/User.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/users
// @desc    Create a new user profile
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Profile saved successfully', user: savedUser });
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all user profiles (Admin only)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

export default router;
