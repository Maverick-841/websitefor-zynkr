import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String },
  experienceLevel: { type: String, required: true },
  roles: [{ type: String }],
  skills: [{ type: String }],
  languages: [{ type: String }],
  github: { type: String },
  linkedin: { type: String },
  leetcode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
