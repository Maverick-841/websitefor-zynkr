import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Login admin and get token
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simple hardcoded check against env vars
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const payload = { isAdmin: true, email };
    
    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    return res.status(200).json({ token, message: 'Admin logged in successfully' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
