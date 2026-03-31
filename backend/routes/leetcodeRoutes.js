import express from 'express';
import LeetCodeAnalysis from '../models/LeetCodeAnalysis.js';

const router = express.Router();

function extractLeetCodeUsername(leetcodeUrl = '') {
  const text = String(leetcodeUrl).trim();
  if (!text) return null;

  const patterns = [
    /leetcode\.com\/u\/([a-zA-Z0-9_-]+)/i,
    /leetcode\.com\/([a-zA-Z0-9_-]+)\/?$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function getSolvedCountByDifficulty(acSubmissionNum = [], difficulty) {
  const row = acSubmissionNum.find((item) => item?.difficulty?.toLowerCase() === difficulty.toLowerCase());
  return Number(row?.count || 0);
}

function classifyLevel(totalSolved) {
  if (totalSolved < 50) return 'Beginner';
  if (totalSolved <= 200) return 'Intermediate';
  return 'Advanced';
}

function analyzeWeakAreas(easy, medium, hard) {
  const weakAreas = [];
  const strengths = [];

  if (easy > medium) {
    weakAreas.push('Problem-solving depth is low compared to easy problem volume.');
  }

  if (medium < 50) {
    weakAreas.push('Needs improvement in medium-level DSA problems.');
  } else {
    strengths.push('Solid medium-level practice foundation.');
  }

  if (hard < 20) {
    weakAreas.push('Advanced DSA problem-solving is weak (hard problems).');
  } else {
    strengths.push('Good exposure to hard-level problems.');
  }

  if (easy >= 80) {
    strengths.push('Strong easy-level consistency and discipline.');
  }

  return { weakAreas, strengths };
}

function generatePlan(level, easy, medium, hard, total) {
  const suggestions = [];
  let dailyPlan = { easy: 0, medium: 0, hard: 0 };

  if (level === 'Beginner') {
    suggestions.push('Solve 2 easy problems daily to build consistency.');
    suggestions.push('Target your first 50 solved problems with arrays, strings, and hashing patterns.');
    suggestions.push('Revise solved questions weekly and write short pattern notes.');
    dailyPlan = { easy: 2, medium: 0, hard: 0 };
  }

  if (level === 'Intermediate') {
    suggestions.push('Solve 2 medium problems daily and 3-4 easy problems weekly for speed.');
    suggestions.push('Focus on arrays, binary search, trees, and dynamic programming patterns.');
    suggestions.push('Start weekly contest participation for timed problem-solving improvement.');
    dailyPlan = { easy: 0, medium: 2, hard: 0 };
  }

  if (level === 'Advanced') {
    suggestions.push('Focus on hard problems and multi-pattern questions.');
    suggestions.push('Participate in weekly contests and virtual contests regularly.');
    suggestions.push('Practice advanced topics like graphs, DP optimization, and segment trees.');
    dailyPlan = { easy: 0, medium: 1, hard: 1 };
  }

  if (medium < 50) {
    suggestions.push('Solve at least 20 more medium problems in the next 15 days.');
  }

  if (hard < 20) {
    suggestions.push('Add at least 10 hard problems over the next 30 days.');
  }

  const challenge = medium < 50
    ? `You solved only ${medium} medium problems. Target: Solve ${Math.max(20, 50 - medium)} more medium in next 15 days.`
    : hard < 20
      ? `You solved ${hard} hard problems. Target: Solve ${20 - hard} more hard in next 30 days.`
      : `Great pace with ${total} solved. Target: Maintain consistency with weekly contests and advanced topics.`;

  return { suggestions: [...new Set(suggestions)].slice(0, 6), dailyPlan, challenge };
}

async function fetchLeetCodeStats(username) {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({ query, variables: { username } })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LeetCode data. Please try again.');
  }

  const payload = await response.json();
  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'LeetCode API returned an error.');
  }

  const matchedUser = payload?.data?.matchedUser;
  if (!matchedUser) {
    throw new Error('Invalid LeetCode username or profile is not public.');
  }

  return matchedUser;
}

router.post('/analyze', async (req, res) => {
  try {
    const { leetcodeUrl = '' } = req.body || {};

    if (!leetcodeUrl || !String(leetcodeUrl).trim()) {
      return res.status(400).json({ success: false, message: 'LeetCode URL is required.' });
    }

    const username = extractLeetCodeUsername(leetcodeUrl);
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LeetCode URL. Use format: https://leetcode.com/u/username/'
      });
    }

    const matchedUser = await fetchLeetCodeStats(username);
    const acSubmissionNum = matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

    const easy = getSolvedCountByDifficulty(acSubmissionNum, 'Easy');
    const medium = getSolvedCountByDifficulty(acSubmissionNum, 'Medium');
    const hard = getSolvedCountByDifficulty(acSubmissionNum, 'Hard');
    const all = getSolvedCountByDifficulty(acSubmissionNum, 'All');
    const total = all || (easy + medium + hard);
    const ranking = matchedUser?.profile?.ranking || null;

    const level = classifyLevel(total);
    const { weakAreas, strengths } = analyzeWeakAreas(easy, medium, hard);
    const { suggestions, dailyPlan, challenge } = generatePlan(level, easy, medium, hard, total);

    const previous = await LeetCodeAnalysis.findOne({ username }).sort({ createdAt: -1 }).lean();
    const previousTotal = previous?.stats?.total ?? null;
    const deltaTotal = previousTotal !== null ? total - previousTotal : null;

    const result = {
      success: true,
      username,
      level,
      stats: { easy, medium, hard, total },
      ranking,
      weakAreas,
      strengths,
      suggestions,
      dailyPlan,
      challenge,
      progress: {
        previousTotal,
        deltaTotal,
        improved: deltaTotal !== null ? deltaTotal > 0 : null
      }
    };

    try {
      await LeetCodeAnalysis.create({
        username,
        leetcodeUrl,
        level,
        stats: { easy, medium, hard, total },
        ranking,
        weakAreas,
        strengths,
        suggestions,
        dailyPlan,
        challenge
      });
    } catch (dbErr) {
      result.storageNote = 'Analysis generated, but could not store to DB.';
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to analyze LeetCode profile right now.'
    });
  }
});

export default router;
