import mongoose from 'mongoose';

const leetCodeAnalysisSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  leetcodeUrl: { type: String, required: true },
  level: { type: String, required: true },
  stats: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  ranking: { type: Number, default: null },
  weakAreas: [{ type: String }],
  strengths: [{ type: String }],
  suggestions: [{ type: String }],
  dailyPlan: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  challenge: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const LeetCodeAnalysis = mongoose.model('LeetCodeAnalysis', leetCodeAnalysisSchema);
export default LeetCodeAnalysis;
