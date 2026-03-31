import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Login admin and get token
router.post('/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '').trim();

  const adminEmail = String(process.env.ADMIN_EMAIL || 'admin@zynkr.com').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || 'adminpassword').trim();

  // Simple hardcoded check against env vars
  if (email === adminEmail && password === adminPassword) {
    const payload = { isAdmin: true, email };
    
    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    return res.status(200).json({ token, message: 'Admin logged in successfully' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all user profiles (protected)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find().sort({ updatedAt: -1, createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
