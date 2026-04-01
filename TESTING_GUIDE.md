# 🎯 Resume Upload Feature - Complete Setup & Testing Guide

## ✅ Verification Status

Last reviewed: 2026-04-01 (save/edit profile flow and admin visibility confirmed in latest build).

All components are correctly configured:

| Component | Status | Notes |
|-----------|--------|-------|
| Directories | ✅ | `/uploads/resumes/` and `/uploads/profiles/` created |
| CORS Configuration | ✅ | Origins 5173, 5174, 3000 enabled with credentials |
| Multer Setup | ✅ | 2MB limit, PDF/DOC/DOCX validation |
| Database Model | ✅ | `resumeUrl` field added to User schema |
| Frontend Forms | ✅ | `credentials: 'include'` in all fetch calls |
| Upload Endpoint | ✅ | `/api/profile/upload-resume` ready |
| File Serving | ✅ | Static file serving at `/uploads/` configured |

## 🚀 Quick Start Testing

### Prerequisite: Start All Servers

Before testing, ensure all three servers are running:

```bash
# Terminal 1: Backend (Port 5000)
cd backend
npm start

# Terminal 2: Frontend (Port 5173)
cd frontend
npm run dev

# Terminal 3: Admin (Port 5174)
cd admin
npm run dev
```

Expected outputs:
- Backend: `Server running on port 5000`
- Frontend: `Local: http://localhost:5173`
- Admin: `Local: http://localhost:5174`

---

## 📝 Complete Testing Workflow

### Test 1: Basic Resume Upload (PDF)

**Objective:** Verify PDF file upload works end-to-end

**Steps:**

1. Open http://localhost:5173 in browser
2. Open DevTools (F12) → Network tab
3. Fill profile form with:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
   - Gender: Any option
   - DOB: Any date
   - College: `IIT Bombay`
   - Experience: `2 years`
   - Select Roles: ✓ (any role)
   - Select Skills: ✓ (any skill)
   - Select Languages: ✓ (any language)
   - GitHub URL: `https://github.com/john`
   - LinkedIn URL: `https://linkedin.com/in/john`

4. Scroll to "Web Presence" section
5. Click "Choose Resume File" button
6. Select a **PDF file** from your computer (~<2MB)
7. **Expected Result:**
   - File selected message displays
   - Network tab shows POST to `/api/profile/upload-resume` with status 200
   - Filename appears next to button with checkmark
   - No red error message

8. Click "Submit" button
9. **Expected Result:**
   - Form validates all fields
   - POST to `/api/profile/save` with status 201
   - Page shows "AI Analysis Report" modal
   - Form resets

10. Check backend console for logs:
    ```
    [Resume Upload] Request received
    [Resume Upload] File: yourfile.pdf, MIME: application/pdf, Ext: .pdf
    [Resume Upload] ✓ File accepted
    [Resume Upload] ✓ File saved: 1234567890-yourfile.pdf
    ```

### Test 2: Multiple File Formats

**Objective:** Verify DOC and DOCX files also work

**Repeat Test 1 with:**
- Step 6 alternative: Select a **.DOC** file
- Step 6 alternative: Select a **.DOCX** file
- **Expected Result:** All three formats (PDF, DOC, DOCX) upload successfully

### Test 3: File Size Validation

**Objective:** Verify 2MB limit is enforced

**Steps:**

1. Create or find a file larger than 2MB (e.g., 2.5MB)
2. Attempt to upload it following Test 1 steps 1-6
3. **Expected Result:**
   - Frontend error message: "File size exceeds 2MB limit"
   - No POST request sent to backend
   - Filename doesn't appear

### Test 4: File Type Validation

**Objective:** Verify invalid file types are rejected

**Steps:**

1. Attempt to upload invalid file types (TXT, JPG, PNG, EXE, etc.)
2. **Expected Result (Frontend):**
   - Error message: "File type not supported"
   - No POST request sent to backend

3. If bypass somehow succeeded:
4. **Expected Result (Backend):**
   - 400 status with message: "Only PDF, DOC, and DOCX files are allowed"

### Test 5: Admin Dashboard Display

**Objective:** Verify resume appears in admin dashboard

**Steps:**

1. Navigate to http://localhost:5174
2. Login with:
   - Email: `admin@zynkr.com`
   - Password: `adminpassword`
3. Look at users table
4. Click "View Details" button for the user you created in Test 1
5. **Expected Result:**
   - Modal opens showing all user details
   - Resume URL visible in details (e.g., `/uploads/resumes/1234567890-yourfile.pdf`)
   - Resume URL is clickable
   - Clicking opens/downloads the resume file

### Test 6: Profile Completion Percentage

**Objective:** Verify resume counts as 20% of completion

**Steps:**

1. Create profile WITHOUT resume → Profile completion shows 80%
2. Add all other fields but not resume → Repeat form with resume → Profile completion shows 100%

**Expected Breakdown:**
- Basic Info (name, email, phone, DOB, college, experience): 18%
- Roles: 10%
- Skills: 10%
- Languages: 10%
- GitHub URL: 13%
- LinkedIn URL: 13%
- **Resume: 20%** ← Should change from 0 to 20%
- LeetCode (optional): 6%

### Test 7: Resume Access via Direct URL

**Objective:** Verify uploaded file is accessible via URL

**Steps:**

1. Note the resume filename from admin dashboard (e.g., `1234567890-yourfile.pdf`)
2. Open new tab and navigate to:
   ```
   http://localhost:5000/uploads/resumes/1234567890-yourfile.pdf
   ```
3. **Expected Result:**
   - File downloads or opens in browser
   - File is readable/intact
   - File is the same one you uploaded

### Test 8: Mandatory Resume Validation

**Objective:** Verify form won't submit without resume

**Steps:**

1. Fill all fields EXCEPT resume upload
2. Click "Submit" button
3. **Expected Result:**
   - Form doesn't submit
   - Red error appears: "Resume upload is mandatory"
   - POST to `/api/profile/save` is NOT sent

---

## 🐛 Troubleshooting Guide

### Issue: "route not found" Error

**Symptoms:**
- Clicking upload button gives "route not found"
- Network tab shows OPTIONS request to `/upload-resume` failing

**Solutions:**

1. Check browser console (F12):
   - Look for CORS error message
   - Should mention `Access-Control-Allow-Origin`

2. Verify fetch includes credentials:
   ```javascript
   // Should have this line:
   credentials: 'include'
   ```

3. Verify backend CORS config:
   ```javascript
   // Should have:
   credentials: true
   ```

4. Try clearing browser cache:
   - DevTools → Network → Disable cache ✓
   - Refresh page (Ctrl+Shift+R)

5. Check backend logging:
   ```
   [Resume Upload] Request received
   [Resume Upload] Headers: { ... 'origin': 'http://localhost:5173' }
   ```

**If still failing:**
- Check if backend is running on port 5000
- Verify CORS middleware is loaded before routes
- Restart backend server

### Issue: "File type not supported" Error

**Symptoms:**
- Frontend rejects file immediately

**Solutions:**

1. Verify file extension is correct:
   - `.pdf` (not .PDF)
   - `.doc` or `.docx` (check exact spelling)

2. Check file MIME type:
   - Open DevTools → Network tab
   - Look at request headers for `content-type`
   - Should be `multipart/form-data`

3. Try different file:
   - Download sample PDF from web
   - Try uploading that file

### Issue: "File size exceeds 2MB limit" Error

**Symptoms:**
- Valid PDF/DOC/DOCX file rejected for size

**Solutions:**

1. Check actual file size:
   ```powershell
   # PowerShell
   (Get-Item "path/to/file.pdf").Length / 1MB
   ```

2. Reduce file size:
   - Use online PDF compressor
   - Convert to lower quality if image-heavy
   - Ensure < 2MB exactly

3. If file is truly < 2MB:
   - Clear browser cache
   - Restart backend
   - Try different file

### Issue: File Uploaded But Not in Database

**Symptoms:**
- Upload shows success
- But admin dashboard doesn't show resume

**Solutions:**

1. Verify backend saved file:
   ```bash
   # Check if file exists
   ls backend/uploads/resumes/
   ```

2. Check browser console for form submission error:
   - Look for "Failed to save user profile"
   - Note the full error message

3. Verify database connection:
   ```bash
   # Backend should show:
   # "MongoDB connected successfully"
   ```

4. Check MongoDB directly:
   ```javascript
   // In MongoDB console:
   db.users.findOne({ email: "john@example.com" })
   // Should show resumeUrl field
   ```

### Issue: Resume Not Accessible After Upload

**Symptoms:**
- Upload succeeds
- Admin shows resume URL
- But clicking URL gives 404

**Solutions:**

1. Verify file exists:
   ```bash
   ls frontend/uploads/resumes/  # ❌ WRONG LOCATION
   ls backend/uploads/resumes/   # ✅ CORRECT LOCATION
   ```

2. Verify static file serving in backend:
   ```javascript
   // Should have in server.js:
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
   ```

3. Try direct URL:
   ```
   http://localhost:5000/uploads/resumes/filename.pdf
   ```
   Not:
   ```
   http://localhost:5000/resumes/filename.pdf  ❌
   http://localhost:5173/uploads/resumes/...   ❌
   ```

4. Check backend server logs for 404 errors

---

## 📊 Data Flow Diagram

```
USER UPLOADS RESUME
        ↓
Frontend validates file
├─ Check extension (.pdf, .doc, .docx)
├─ Check MIME type
├─ Check size (< 2MB)
        ↓ All checks pass
Frontend sends POST with credentials
        ↓
Backend receives multipart/form-data
├─ CORS preflight (OPTIONS) succeeds
├─ Multer processes upload
├─ File validator runs
├─ File saved to disk: backend/uploads/resumes/[filename]
        ↓
Backend responds with resumeUrl
        ↓
Frontend stores resumeUrl in form state
        ↓
User fills remaining fields and submits form
        ↓
Frontend sends POST /api/profile/save
├─ Includes resumeUrl in payload
├─ Validates all mandatory fields
        ↓
Backend creates User document with resumeUrl
        ↓
USER PROFILE COMPLETE ✅
        ↓
Admin accesses profile
├─ Fetches user from database
├─ Displays resumeUrl as link
├─ User clicks link
        ↓
Backend serves file from disk
        ↓
FILE DOWNLOADED/OPENED ✅
```

---

## 🔧 Configuration Summary

### Frontend (`frontend/src/components/Onboarding/OnboardingFlow.jsx`)

**Resume Upload Function:**
```javascript
const handleResumeUpload = async (file) => {
  // Validates: PDF/DOC/DOCX, < 2MB
  // Uploads to: POST http://localhost:5000/api/profile/upload-resume
  // Option: credentials: 'include' (enables CORS with cookies)
  // On success: Stores resumeUrl in formData.resumeUrl
  // On error: Shows error message
}
```

**Profile Save:**
```javascript
const handleSubmit = async () => {
  // Validates: All mandatory fields including resumeUrl
  // Sends to: POST http://localhost:5000/api/profile/save
  // Option: credentials: 'include'
  // Payload includes: resumeUrl, fullName, email, phone, roles[], skills[], etc.
}
```

### Backend (`backend/routes/profileRoutes.js`)

**Upload Endpoint:**
```
POST /api/profile/upload-resume
Method: POST with file upload
Input: FormData with 'resume' file field
Validation: 
  - MIME type: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - Extension: .pdf, .doc, .docx
  - Size: < 2MB
Storage: backend/uploads/resumes/[timestamp]-[originalname]
Response: { resumeUrl, fileName, fileSize, timestamp }
```

**Save Endpoint:**
```
POST /api/profile/save
Validation: resumeUrl required, all other mandatory fields
Database: Saves entire req.body to User collection
Response: { message, user }
```

### Backend Server (`backend/server.js`)

**CORS Configuration:**
```javascript
{
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}
```

**Static File Serving:**
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// Makes /backend/uploads/resumes/file.pdf accessible at:
// http://localhost:5000/uploads/resumes/file.pdf
```

---

## ✨ Testing Verification Checklist

Print this out and check off as you test:

```
[ ] Test 1: Basic PDF Upload
[ ] Test 2: Multiple Formats (PDF, DOC, DOCX)
[ ] Test 3: File Size Validation
[ ] Test 4: File Type Validation
[ ] Test 5: Admin Dashboard Display
[ ] Test 6: Profile Completion Percentage
[ ] Test 7: Resume Access via Direct URL
[ ] Test 8: Mandatory Resume Validation

Troubleshooting (if any Test fails):
[ ] Backend running on port 5000?
[ ] Frontend running on port 5173?
[ ] Admin running on port 5174?
[ ] Network tab shows success (200 status)?
[ ] Backend shows [Resume Upload] logs?
[ ] File appears in /backend/uploads/resumes/?
[ ] Browser cache cleared?
[ ] CORS error in console?
```

---

## 📞 Support

If tests still fail after going through this guide:

1. **Check backend logs** for [Resume Upload] prefix messages
2. **Check browser Network tab** for failed requests
3. **Check browser Console** (F12) for CORS or JavaScript errors
4. **Verify directories** exist: `backend/uploads/resumes/` and `backend/uploads/profiles/`
5. **Verify permissions** - backend directory is writable
6. **Restart all servers** - sometimes fixes caching issues

---

**Last Updated:** 2024
**Feature Status:** ✅ Production Ready
