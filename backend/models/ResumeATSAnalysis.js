import mongoose from 'mongoose';

const resumeATSAnalysisSchema = new mongoose.Schema({
  role: { type: String, default: 'fullstack' },
  fileName: { type: String, default: '' },
  atsScore: { type: Number, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingKeywords: [{ type: String }],
  suggestions: [{ type: String }],
  plan: { type: String, default: '' },
  sectionCheck: {
    skills: { type: Boolean, default: false },
    projects: { type: Boolean, default: false },
    experience: { type: Boolean, default: false },
    education: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

const ResumeATSAnalysis = mongoose.model('ResumeATSAnalysis', resumeATSAnalysisSchema);
export default ResumeATSAnalysis;
