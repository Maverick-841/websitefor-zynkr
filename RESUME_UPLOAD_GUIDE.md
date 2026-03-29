# Resume Upload Feature Guide

## Overview
The resume upload feature allows users to upload their resume (PDF, DOC, or DOCX) as part of their profile completion in the onboarding flow.

## Feature Details

### Mandatory Requirements
Resume upload is **mandatory** for profile completion:
- Profile completion percentage: **20%** allocated to resume
- Prevents form submission without a valid resume file
- Accepts: PDF, DOC, DOCX formats only
- Max file size: 2MB

### How It Works

#### Frontend (OnboardingFlow.jsx)
1. User clicks "Choose Resume File" button
2. Selects a PDF/DOC/DOCX file from their computer
3. Frontend validates:
   - File type (application/pdf, .doc, .docx only)
   - File size (max 2MB)
4. File is uploaded via `POST /api/profile/upload-resume` with `credentials: 'include'`
5. Backend returns `resumeUrl` which is stored in form data
6. Filename and upload status displayed to user
7. User can submit profile form only after:
   - Resume uploaded successfully
   - All other mandatory fields filled (name, email, phone, gender, DOB, college, experience, roles, skills, languages, GitHub URL, LinkedIn URL)

#### Backend (profileRoutes.js)
1. Multer handles file upload with diskStorage
2. File validation via custom fileFilter
3. File saved to `backend/uploads/resumes/` with timestamp-based filename
4. Response includes:
   - `resumeUrl`: Path to access file (e.g., `/uploads/resumes/1234567890-resume.pdf`)
   - `fileName`: Original filename
   - `fileSize`: File size in bytes
   - `timestamp`: Upload timestamp

#### File Access
Uploaded resumes are served statically from:
- **URL Pattern**: `http://localhost:5000/uploads/resumes/{filename}`
- **Accessible from**: Admin dashboard, profile view, anywhere resume is displayed

### Error States

| Error | Cause | Solution |
|-------|-------|----------|
| "File type not supported" | Non-PDF/DOC/DOCX file | Select PDF, DOC, or DOCX file |
| "File size exceeds 2MB limit" | File too large | Reduce file size below 2MB |
| "route not found" | CORS preflight failure | Check browser console for CORS errors |
| "No file uploaded" | File didn't attach to request | Check file was selected properly |
| "Resume upload is mandatory" | Form validation | Upload resume before submitting |

### Testing Resume Upload

#### Basic Test
```
1. Navigate to http://localhost:5173
2. Fill profile form
3. Click "Upload Resume" 
4. Select any PDF file
5. Verify: Filename appears with checkmark
6. Click "Submit"
7. Verify: Form saves successfully
```

#### Advanced Test
```
1. Use various file formats (PDF, DOC, DOCX)
2. Test with 2MB file (should work)
3. Test with 2.1MB file (should fail)
4. Check backend logs for upload details
5. Verify file saved to backend/uploads/resumes/
6. Verify admin can download resume from admin dashboard
```

### Backend Logs

When resume is uploaded, you'll see:
```
[Resume Upload] Request received
[Resume Upload] Headers: { ... }
[Resume Upload] File: resume.pdf, MIME: application/pdf, Ext: .pdf
[Resume Upload] ✓ File accepted
[Resume Upload] ✓ File saved: 1234567890-resume.pdf
```

## Technical Details

### API Endpoint
```
POST /api/profile/upload-resume
Content-Type: multipart/form-data

FormData:
- resume: <File object>

Response (200 OK):
{
  "message": "Resume uploaded successfully",
  "resumeUrl": "/uploads/resumes/1234567890-resume.pdf",
  "fileName": "resume.pdf",
  "fileSize": 12345,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Multer Configuration
```javascript
// File size limit: 2MB
limits: { fileSize: 2 * 1024 * 1024 }

// Allowed file types
Allowed MIME Types: 
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document

Allowed Extensions: .pdf, .doc, .docx

// Storage location
backend/uploads/resumes/[timestamp]-[originalname]
```

### Important Notes

1. **CORS Requirements**
   - Frontend must use `credentials: 'include'` in fetch options
   - Backend CORS configured with `credentials: true`
   - Enables browser to send cookies/credentials with cross-origin requests

2. **File Storage**
   - Files stored locally on server disk
   - Persisted across page reloads
   - Accessible via static file serving endpoint

3. **Production Considerations**
   - Consider cloud storage (AWS S3, Azure Blob) for scalability
   - Implement virus scanning for uploaded files
   - Add authentication check to prevent unauthorized downloads
   - Consider file expiration policy

## Troubleshooting

### Issue: "route not found" error
**Cause**: CORS preflight failure
**Solution**: 
- Check browser Network tab for OPTIONS request status
- Verify backend CORS middleware configured
- Ensure frontend fetch includes `credentials: 'include'`

### Issue: File accepted but not saved
**Cause**: Directory permissions or disk space
**Solution**:
- Check backend/uploads/resumes/ directory exists
- Verify write permissions on directory
- Check available disk space

### Issue: Resume not appearing in admin dashboard
**Cause**: Database not updated with resumeUrl
**Solution**:
- Verify profile form saved to database
- Check user document has `resumeUrl` field populated
- Verify file is accessible at the URL

## Files Involved
- Frontend: `frontend/src/components/Onboarding/OnboardingFlow.jsx`
- Backend: `backend/routes/profileRoutes.js`
- Database: `backend/models/User.js` (resumeUrl field)
- Server Config: `backend/server.js` (static file serving)
