import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import ResumeATSAnalysis from '../models/ResumeATSAnalysis.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const name = file.originalname.toLowerCase();
    const isValidExt = name.endsWith('.pdf') || name.endsWith('.docx');
    if (allowed.includes(file.mimetype) || isValidExt) {
      return cb(null, true);
    }

    return cb(new Error('Invalid file type. Please upload PDF or DOCX only.'));
  }
});

const ROLE_KEYWORDS = {
  frontend: ['html', 'css', 'javascript', 'react', 'tailwind', 'next.js'],
  backend: ['node', 'express', 'mongodb', 'sql', 'api'],
  fullstack: ['react', 'node', 'mongodb', 'api'],
  dsa: ['data structures', 'algorithms', 'leetcode']
};

const UNIVERSAL_KEYWORDS = [
  'problem solving',
  'teamwork',
  'communication',
  'leadership',
  'git',
  'github'
];

function normalizeText(text = '') {
  return String(text)
    .replace(/\s+/g, ' ')
    .replace(/\u0000/g, ' ')
    .trim()
    .toLowerCase();
}

async function extractResumeText(file) {
  const lowerName = file.originalname.toLowerCase();

  if (lowerName.endsWith('.pdf') || file.mimetype === 'application/pdf') {
    const parsed = await pdfParse(file.buffer);
    return parsed?.text || '';
  }

  if (lowerName.endsWith('.docx') || file.mimetype.includes('officedocument.wordprocessingml.document')) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed?.value || '';
  }

  throw new Error('Unsupported resume format.');
}

function detectSections(text) {
  const hasSection = (pattern) => pattern.test(text);
  return {
    skills: hasSection(/\bskills?\b/),
    projects: hasSection(/\bprojects?\b/),
    experience: hasSection(/\bexperience\b|\bwork history\b/),
    education: hasSection(/\beducation\b|\bacademic\b/)
  };
}

function countProjects(text) {
  const projectHeadingHits = (text.match(/\bprojects?\b/g) || []).length;
  const builtHits = (text.match(/\bbuilt\b|\bdeveloped\b|\bimplemented\b/g) || []).length;
  return Math.max(projectHeadingHits, Math.min(6, builtHits));
}

function hasMeasurableAchievements(text) {
  return /(\d+%|\d+\+|increased|reduced|improved|optimized|scaled|saved)/i.test(text);
}

function roleKeywordSet(role) {
  if (role === 'frontend') return [...ROLE_KEYWORDS.frontend, ...ROLE_KEYWORDS.dsa];
  if (role === 'backend') return [...ROLE_KEYWORDS.backend, ...ROLE_KEYWORDS.dsa];
  if (role === 'fullstack') return [...ROLE_KEYWORDS.fullstack, ...ROLE_KEYWORDS.frontend, ...ROLE_KEYWORDS.backend];
  return [...ROLE_KEYWORDS.fullstack, ...ROLE_KEYWORDS.dsa];
}

function analyzeResume(text, role = 'fullstack') {
  const selectedRole = ['frontend', 'backend', 'fullstack'].includes(role) ? role : 'fullstack';
  const sections = detectSections(text);
  const keywords = roleKeywordSet(selectedRole);
  const allExpectedKeywords = [...new Set([...keywords, ...UNIVERSAL_KEYWORDS])];

  const presentKeywords = allExpectedKeywords.filter((kw) => text.includes(kw));
  const missingKeywords = allExpectedKeywords.filter((kw) => !text.includes(kw));

  const projectCount = countProjects(text);
  const measurable = hasMeasurableAchievements(text);

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  let skillsScore = 0;
  let projectsScore = 0;
  let experienceScore = 0;
  let keywordsScore = 0;
  let formattingScore = 0;

  const skillMatchRatio = keywords.length ? (keywords.filter((k) => text.includes(k)).length / keywords.length) : 0;
  skillsScore = Math.round(skillMatchRatio * 30);
  if (skillsScore >= 18) {
    strengths.push('Good skills match for target role.');
  } else {
    weaknesses.push('Role-specific skills are missing or weak.');
    suggestions.push('Add role-specific skills aligned with job descriptions.');
  }

  if (sections.projects && projectCount >= 2) {
    projectsScore = 20;
    strengths.push('Projects section is present with practical work evidence.');
  } else if (sections.projects) {
    projectsScore = 10;
    weaknesses.push('Projects section exists but lacks depth or count.');
    suggestions.push('Include 2-3 real projects with stack, impact, and GitHub links.');
  } else {
    projectsScore = 0;
    weaknesses.push('Projects section is missing.');
    suggestions.push('Add a dedicated Projects section with measurable outcomes.');
  }

  if (sections.experience && measurable) {
    experienceScore = 20;
    strengths.push('Experience includes measurable achievements.');
  } else if (sections.experience) {
    experienceScore = 10;
    weaknesses.push('Experience lacks measurable achievements.');
    suggestions.push('Use quantified achievements (%, time saved, users impacted).');
  } else {
    experienceScore = 0;
    weaknesses.push('Experience section is missing.');
    suggestions.push('Add internship/work/volunteer experience with action verbs.');
  }

  const keywordMatchRatio = allExpectedKeywords.length ? (presentKeywords.length / allExpectedKeywords.length) : 0;
  keywordsScore = Math.round(keywordMatchRatio * 15);
  if (keywordsScore >= 9) {
    strengths.push('Keyword coverage is decent for ATS matching.');
  } else {
    weaknesses.push('Keyword gap may reduce ATS visibility.');
    suggestions.push('Add missing keywords naturally in skills and projects.');
  }

  const sectionCount = Object.values(sections).filter(Boolean).length;
  const hasContact = /@|linkedin|github|\+\d{1,3}/i.test(text);
  const properLength = text.length > 250;

  formattingScore = 0;
  if (sectionCount >= 3) formattingScore += 7;
  if (hasContact) formattingScore += 4;
  if (properLength) formattingScore += 4;

  if (formattingScore >= 10) {
    strengths.push('Resume structure is ATS-friendly.');
  } else {
    weaknesses.push('Resume structure/formatting can be improved.');
    suggestions.push('Use clear section headings: Skills, Projects, Experience, Education.');
  }

  if (!sections.skills) suggestions.push('Add a dedicated Skills section with grouped technologies.');
  if (!sections.education) suggestions.push('Add Education section with degree and graduation year.');

  suggestions.push('Use strong action verbs like Built, Developed, Optimized.');
  suggestions.push('Add GitHub links for major projects.');

  const atsScore = Math.max(0, Math.min(100, skillsScore + projectsScore + experienceScore + keywordsScore + formattingScore));

  const planTarget = Math.min(95, Math.max(atsScore + 20, 85));
  const plan = `Increase ATS score from ${atsScore} -> ${planTarget} by adding 2 strong projects, covering missing keywords (${missingKeywords.slice(0, 5).join(', ') || 'role-specific skills'}), and adding measurable achievements.`;

  return {
    atsScore,
    strengths: [...new Set(strengths)].slice(0, 6),
    weaknesses: [...new Set(weaknesses)].slice(0, 6),
    missingKeywords: missingKeywords.slice(0, 12),
    suggestions: [...new Set(suggestions)].slice(0, 8),
    plan,
    sectionCheck: sections,
    breakdown: {
      skills: skillsScore,
      projects: projectsScore,
      experience: experienceScore,
      keywords: keywordsScore,
      formatting: formattingScore
    },
    projectCount,
    selectedRole
  };
}

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const role = String(req.body?.role || 'fullstack').toLowerCase();

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const rawText = await extractResumeText(req.file);
    const cleaned = normalizeText(rawText);

    if (!cleaned || cleaned.length < 80) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract enough text from resume. Please upload a clearer PDF/DOCX.'
      });
    }

    const result = analyzeResume(cleaned, role);

    try {
      await ResumeATSAnalysis.create({
        role: result.selectedRole,
        fileName: req.file.originalname,
        atsScore: result.atsScore,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        missingKeywords: result.missingKeywords,
        suggestions: result.suggestions,
        plan: result.plan,
        sectionCheck: result.sectionCheck
      });
    } catch (dbErr) {
      result.storageNote = 'Analysis complete, but failed to store in database.';
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume.'
    });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
  }

  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'Upload failed.' });
  }

  return next();
});

export default router;
