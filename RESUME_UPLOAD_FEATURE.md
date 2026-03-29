# Resume Upload Feature - Implementation Guide

## Overview
A complete resume upload feature has been integrated into the Zynkr E-Learning platform. Users can now upload their resume files (PDF, DOC, DOCX) directly during profile completion.

---

## Features Implemented

### 1. **Frontend UI Components** ✅
**Location**: `frontend/src/components/Onboarding/OnboardingFlow.jsx`

#### Resume Upload Field
- **Placement**: Web Presence section (next to LinkedIn URL)
- **UI Elements**:
  - Drag-and-drop style file upload button
  - Shows "📄 Upload Resume (PDF/DOC/DOCX)" label
  - Displays upload progress with animated icon
  - Shows selected filename after upload
  - Option to replace uploaded file

#### File Validation (Frontend)
- Allowed formats: PDF, DOC, DOCX
- Maximum file size: 2MB
- Real-time error messages for invalid files
- User-friendly error displays

#### Upload States
- **Default**: Shows upload prompt with file requirements
- **Uploading**: Shows animated loading state
- **Success**: Displays filename with green indicator (✓)
- **Error**: Shows validation error messages in red

---

### 2. **Backend API Endpoints** ✅
**Location**: `backend/routes/profileRoutes.js`

#### New Endpoint: POST `/api/profile/upload-resume`
```javascript
// Request: multipart/form-data
Content-Type: multipart/form-data
Body: {
  resume: <File>
}

// Response (Success - 200)
{
  message: "Resume uploaded successfully",
  resumeUrl: "/uploads/resumes/1234567890-987654.pdf",
  fileName: "my_resume.pdf",
  fileSize: 512000
}

// Response (Error)
{
  message: "Error message describing the issue",
  error: "Detailed error information"
}
```

#### Error Handling
- `400`: Invalid file type or file too large
- `500`: Server error during upload

---

### 3. **File Upload Configuration** ✅
**Location**: `backend/routes/profileRoutes.js`

#### Multer Configuration
```javascript
// Storage
- Destination: backend/uploads/resumes/
- Filename: Unique timestamp-based naming

// File Filter
- Allowed MIME types:
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Allowed extensions: .pdf, .doc, .docx

// Size Limit
- Maximum: 2MB (2097152 bytes)
```

---

### 4. **Database Schema Updates** ✅
**Location**: `backend/models/User.js`

#### Added Fields
```javascript
resumeUrl: { type: String },  // Stored file path/URL
```

#### Field Description
- **resumeUrl**: String containing the path to uploaded resume
- Stored as relative path: `/uploads/resumes/filename.pdf`
- Can be accessed via: `http://localhost:5000/uploads/resumes/filename.pdf`

---

### 5. **Server Configuration Updates** ✅
**Location**: `backend/server.js`

#### Static File Serving
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
- Serves uploaded files at `/uploads/` endpoint
- Allows direct access to uploaded resumes

#### JSON Payload Limits
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```
- Increased limits to handle large base64-encoded files if needed

---

## File Structure

```
backend/
├── uploads/
│   ├── resumes/          # Resume files stored here
│   └── profiles/         # Profile images (future use)
├── routes/
│   └── profileRoutes.js  # Upload endpoint handler
├── models/
│   └── User.js           # Database schema with resumeUrl
├── server.js             # Static file serving configuration
├── .gitignore            # Excludes uploads/ from version control
└── package.json          # multer dependency added
```

---

## User Flow

1. **User fills profile form** in OnboardingFlow
2. **Navigates to Web Presence section**
3. **Clicks on resume upload button**
4. **Selects PDF/DOC/DOCX file** from device
5. **System validates**:
   - File type ✓
   - File size (≤ 2MB) ✓
6. **File uploads to backend** (`/api/profile/upload-resume`)
7. **Server stores file** in `backend/uploads/resumes/`
8. **Returns file URL** to frontend
9. **Frontend stores URL** in formData (resumeUrl)
10. **User clicks "Save & Continue"**
11. **Profile saved with resume URL** to MongoDB
12. **Admin can access resume** via the stored URL

---

## API Integration Details

### Resume Upload Process

```javascript
// Frontend
const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  
  // Validate file
  const formDataToSend = new FormData();
  formDataToSend.append('resume', file);
  
  // Upload to backend
  const response = await fetch('http://localhost:5000/api/profile/upload-resume', {
    method: 'POST',
    body: formDataToSend  // Note: NOT application/json, but multipart/form-data
  });
  
  // Store resume URL in formData
  formData.resumeUrl = data.resumeUrl;
}
```

### Backend Processing

```javascript
// Backend
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  // Multer handles file validation and storage
  // Returns file path to frontend
  const resumeUrl = `/uploads/resumes/${req.file.filename}`;
  res.json({ resumeUrl });
});
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| "Only PDF, DOC, and DOCX files are allowed" | Wrong file type | Select PDF, DOC, or DOCX file |
| "File size exceeds 2MB limit" | File too large | Reduce file size to < 2MB |
| "No file uploaded" | File not selected | Select a file and try again |
| "Error uploading resume" | Server error | Check backend logs and retry |

---

## Security Considerations

1. **File Type Validation**:
   - Frontend: JavaScript validation
   - Backend: MIME type + extension check (double validation)

2. **File Size Limits**:
   - Set to 2MB to prevent abuse
   - Prevents storage issues

3. **Unique Filenames**:
   - Files stored with timestamp + random suffix
   - Prevents filename collisions and overwrite attacks

4. **CORS Configuration**:
   - Frontend and backend origins properly configured
   - File uploads work across different ports

5. **Static File Access**:
   - Only `/uploads` folder is served publicly
   - Other sensitive files are protected

---

## Testing Instructions

### 1. Test Resume Upload

```bash
# Navigate to Frontend
http://localhost:5173

# Complete profile form
# In Web Presence section, upload a PDF/DOC/DOCX file (< 2MB)

# Verify:
✓ File selected shows in UI
✓ Green checkmark appears after upload
✓ Filename displayed

# Submit form
# Check backend - file should be in backend/uploads/resumes/
```

### 2. Test File Validation

```bash
# Test 1: Invalid file type
- Try uploading .txt file
- Should show error: "Only PDF, DOC, and DOCX files are allowed"

# Test 2: File too large
- Try uploading file > 2MB
- Should show error: "File size exceeds 2MB limit"

# Test 3: Valid file
- Upload .pdf file
- Should succeed with checkmark
```

### 3. Test Database Storage

```bash
# After uploading, submit form
# Check MongoDB for user record
# Field "resumeUrl" should contain: "/uploads/resumes/[filename]"

# Access resume from admin:
# Open: http://localhost:5000/uploads/resumes/[filename]
# Should download or display the resume
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/api/profile/save` | Save profile (JSON) | JSON body | User object |
| POST | `/api/profile/upload-resume` | Upload resume file | multipart/form-data | Resume URL |

---

## Dependencies Added

```json
{
  "multer": "^1.4.5-lts.1"  // File upload middleware for Express
}
```

---

## Environment Notes

- **Backend runs on**: `http://localhost:5000`
- **Frontend runs on**: `http://localhost:5173`
- **Admin runs on**: `http://localhost:5174`
- **Uploads accessible at**: `http://localhost:5000/uploads/resumes/[filename]`

---

## Future Enhancements

1. **Cloud Storage Integration**
   - AWS S3 / Firebase Storage support
   - Replace local file storage

2. **Resume Parsing**
   - Extract text from PDF
   - Auto-populate skills from resume

3. **Resume Preview**
   - Inline PDF viewer
   - Show resume details in admin dashboard

4. **Multiple File Types**
   - Support images, portfolios
   - Link to external resume URLs

5. **Resume Version Control**
   - Multiple resume uploads
   - Version history tracking

---

## Troubleshooting

**Problem**: Upload fails with "Error uploading resume"
- **Solution**: Check backend logs, verify uploads folder exists, restart backend

**Problem**: File appears uploaded but not saved to database
- **Solution**: Ensure form submission includes resumeUrl, check MongoDB connection

**Problem**: Cannot access uploaded resume from admin
- **Solution**: Verify `/uploads` endpoint is served, check file path in database

**Problem**: CORS error when uploading
- **Solution**: Check server.js CORS configuration, verify frontend origin is whitelisted

---

## Summary

✅ Resume upload feature fully implemented with:
- Modern UI with drag-drop style interface
- Comprehensive file validation (frontend + backend)
- Secure file storage with unique naming
- Proper error handling and user feedback
- Database integration for persistence
- Ready for cloud storage migration

🎉 Users can now upload resumes during profile creation!
