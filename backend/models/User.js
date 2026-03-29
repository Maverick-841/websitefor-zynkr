import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String },
  college: { type: String },
  experienceLevel: { type: String, required: true },
  roles: [{ type: String }],
  interestRoles: [{ type: String }],
  skills: [{ type: String }],
  languages: [{ type: String }],
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  leetcodeUrl: { type: String },
  profileImage: { type: String },
  resume: { type: String },
  resumeUrl: { type: String },
  profileCompletion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
