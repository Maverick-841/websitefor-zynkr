import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, path.join(__dirname, '../uploads/resumes'));
    } else if (file.fieldname === 'profileImage') {
      cb(null, path.join(__dirname, '../uploads/profiles'));
    } else {
      cb(null, path.join(__dirname, '../uploads'));
    }
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for resume validation - PDF only
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  console.log(`[Resume Upload] File: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
  
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    console.log(`[Resume Upload] ✓ File accepted (PDF)`);
    cb(null, true);
  } else {
    console.log(`[Resume Upload] ✗ File rejected - Only PDF format allowed`);
    cb(new Error('Only PDF format is allowed for resume upload'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// @route   POST /api/profile/save
// @desc    Create a new user profile
router.post('/save', async (req, res) => {
  try {
    // Accept both 'roles' and 'interestRoles' from frontend
    const { fullName, email, phone, gender, dob, experienceLevel, skills, languages, githubUrl, linkedinUrl, resumeUrl } = req.body;
    const roles = req.body.roles || req.body.interestRoles || [];
    const normalizedEmail = String(email || '').trim().toLowerCase();

    console.log('[Profile Save] Request received for:', fullName);
    console.log('[Profile Save] Roles/InterestRoles:', roles);
    console.log('[Profile Save] All body keys:', Object.keys(req.body));

    if (!fullName || !email || !phone || !gender || !dob || !experienceLevel) {
      console.error('[Profile Save] Validation failed: Missing core fields');
      return res.status(400).json({ message: 'Missing required core fields' });
    }

    if (!roles || roles.length === 0) {
      console.error('[Profile Save] Validation failed: No roles provided');
      return res.status(400).json({ message: 'At least one role must be selected' });
    }

    if (!skills || skills.length === 0) {
      console.error('[Profile Save] Validation failed: No skills provided');
      return res.status(400).json({ message: 'At least one skill must be selected' });
    }

    if (!languages || languages.length === 0) {
      console.error('[Profile Save] Validation failed: No languages provided');
      return res.status(400).json({ message: 'At least one language must be selected' });
    }

    // Validate mandatory URLs
    if (!githubUrl || githubUrl.trim() === '') {
      console.error('[Profile Save] Validation failed: No GitHub URL');
      return res.status(400).json({ message: 'GitHub URL is mandatory' });
    }

    if (!githubUrl.includes('github.com')) {
      console.error('[Profile Save] Validation failed: Invalid GitHub URL');
      return res.status(400).json({ message: 'Please provide a valid GitHub URL' });
    }

    if (!linkedinUrl || linkedinUrl.trim() === '') {
      console.error('[Profile Save] Validation failed: No LinkedIn URL');
      return res.status(400).json({ message: 'LinkedIn URL is mandatory' });
    }

    if (!linkedinUrl.includes('linkedin.com')) {
      console.error('[Profile Save] Validation failed: Invalid LinkedIn URL');
      return res.status(400).json({ message: 'Please provide a valid LinkedIn URL' });
    }

    if (!resumeUrl || resumeUrl.trim() === '') {
      console.error('[Profile Save] Validation failed: No resume URL');
      return res.status(400).json({ message: 'Resume upload is mandatory' });
    }

    // Update existing profile when editing, otherwise create a new profile
    let userDoc = null;
    let isNewUser = false;

    const incomingId = String(req.body._id || '').trim();
    if (incomingId) {
      if (mongoose.isValidObjectId(incomingId)) {
        userDoc = await User.findById(incomingId);
        if (userDoc) {
          console.log('[Profile Save] Existing user found by _id:', incomingId);
        }
      } else {
        console.warn('[Profile Save] Ignoring invalid _id value from request:', incomingId);
      }
    }

    if (!userDoc) {
      userDoc = await User.findOne({ email: normalizedEmail });
      if (userDoc) {
        console.log('[Profile Save] Existing user found by email:', normalizedEmail);
      }
    }

    const { _id, createdAt, updatedAt, ...safeBody } = req.body;

    if (userDoc) {
      Object.assign(userDoc, {
        ...safeBody,
        email: normalizedEmail,
        roles: roles,
        interestRoles: req.body.interestRoles || roles,
        updatedAt: new Date()
      });
    } else {
      isNewUser = true;
      userDoc = new User({
        ...safeBody,
        email: normalizedEmail,
        roles: roles,
        interestRoles: req.body.interestRoles || roles,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('[Profile Save] Saving user:', { fullName, email: normalizedEmail, phone, mode: isNewUser ? 'create' : 'update' });
    const savedUser = await userDoc.save();
    console.log('[Profile Save] ✓ User saved successfully with ID:', savedUser._id, 'Mode:', isNewUser ? 'create' : 'update');

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? 'Profile created successfully' : 'Profile updated successfully',
      user: savedUser
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
    console.error('[Profile Save] Error details:', error.message);
    console.error('[Profile Save] Stack:', error.stack);

    if (error?.code === 11000) {
      return res.status(409).json({ message: 'A profile with this email already exists' });
    }

    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({ message: error.message || 'Invalid profile data' });
    }

    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// @route   POST /api/profile/upload-resume
// @desc    Upload resume file
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  console.log('[Resume Upload] Request received');
  console.log('[Resume Upload] Headers:', {
    'content-type': req.headers['content-type'],
    'authorization': req.headers['authorization'] ? 'present' : 'missing',
    'origin': req.headers['origin']
  });

  if (!req.file) {
    console.error('[Resume Upload] No file in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log(`[Resume Upload] ✓ File saved: ${req.file.filename}`);
  
  const resumeUrl = `/uploads/resumes/${req.file.filename}`;
  
  res.status(200).json({
    message: 'Resume uploaded successfully',
    resumeUrl: resumeUrl,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    timestamp: new Date().toISOString()
  });
});

// Error handling for multer
router.use((err, req, res, next) => {
  console.error('[Resume Upload] Error caught:', err.message);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ message: 'File size exceeds 2MB limit' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Only one file allowed' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

export default router;
