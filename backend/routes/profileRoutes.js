import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
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
    // Validate mandatory fields
    const { fullName, email, phone, gender, dob, experienceLevel, roles, skills, languages, githubUrl, linkedinUrl } = req.body;

    if (!fullName || !email || !phone || !gender || !dob || !experienceLevel) {
      return res.status(400).json({ message: 'Missing required core fields' });
    }

    if (!roles || roles.length === 0) {
      return res.status(400).json({ message: 'At least one role must be selected' });
    }

    if (!skills || skills.length === 0) {
      return res.status(400).json({ message: 'At least one skill must be selected' });
    }

    if (!languages || languages.length === 0) {
      return res.status(400).json({ message: 'At least one language must be selected' });
    }

    // Validate mandatory URLs
    if (!githubUrl || githubUrl.trim() === '') {
      return res.status(400).json({ message: 'GitHub URL is mandatory' });
    }

    if (!githubUrl.includes('github.com')) {
      return res.status(400).json({ message: 'Please provide a valid GitHub URL' });
    }

    if (!linkedinUrl || linkedinUrl.trim() === '') {
      return res.status(400).json({ message: 'LinkedIn URL is mandatory' });
    }

    if (!linkedinUrl.includes('linkedin.com')) {
      return res.status(400).json({ message: 'Please provide a valid LinkedIn URL' });
    }

    if (!req.body.resumeUrl || req.body.resumeUrl.trim() === '') {
      return res.status(400).json({ message: 'Resume upload is mandatory' });
    }

    const newUser = new User({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Profile saved successfully', user: savedUser });
  } catch (error) {
    console.error('Error saving user profile:', error);
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
