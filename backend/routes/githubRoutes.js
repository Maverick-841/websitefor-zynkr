import express from 'express';

const router = express.Router();

// @route   GET /api/github/:username
// @desc    Fetch GitHub user repositories data
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Fetch user repos from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=stars&order=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Zynkr-App'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'GitHub user not found' });
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();

    // Filter and format repo data
    const formattedRepos = repos
      .filter(repo => !repo.fork) // Exclude forked repos
      .slice(0, 30) // Get top 30 repos
      .map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description || 'No description',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Unknown',
        createdAt: repo.created_at,
        updatedAt: repo.updated_at
      }));

    console.log(`[GitHub] Fetched ${formattedRepos.length} repos for user: ${username}`);

    res.status(200).json({
      success: true,
      username: username,
      count: formattedRepos.length,
      repos: formattedRepos
    });
  } catch (error) {
    console.error('[GitHub] Error fetching repositories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching GitHub data',
      error: error.message
    });
  }
});

// @route   GET /api/github/:username/suggestions
// @desc    Get project suggestions based on repo count
// @access  Public
router.get('/:username/suggestions', async (req, res) => {
  try {
    const { username } = req.params;
    const { role } = req.query; // frontend, backend, fullstack

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Fetch user repos first
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Zynkr-App'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'GitHub user not found' });
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();
    const repoCount = repos.filter(r => !r.fork).length;

    const suggestions = generateProjectSuggestions(repoCount, role || 'fullstack');

    res.status(200).json({
      success: true,
      username: username,
      portfolioLevel: suggestions.level,
      repoCount: repoCount,
      message: suggestions.message,
      projects: suggestions.projects.map(p => ({
        title: p.name,
        description: p.description,
        skills: p.tech
      }))
    });
  } catch (error) {
    console.error('[GitHub] Error generating suggestions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error generating suggestions',
      error: error.message
    });
  }
});

// Helper function to generate project suggestions
function generateProjectSuggestions(repoCount, role) {
  let suggestions = [];

  if (repoCount < 3) {
    suggestions = generateBeginnerProjects(role);
  } else if (repoCount >= 3 && repoCount <= 6) {
    suggestions = generateIntermediateProjects(role);
  } else {
    suggestions = generateAdvancedProjects(role);
  }

  return {
    level: repoCount < 3 ? 'beginner' : repoCount <= 6 ? 'intermediate' : 'advanced',
    count: repoCount,
    message: repoCount < 3 
      ? `You have ${repoCount} project(s). Build more real-world projects to strengthen your portfolio!`
      : repoCount <= 6
      ? `Good progress! You have ${repoCount} projects. Consider exploring advanced projects.`
      : `Excellent portfolio! You have ${repoCount} projects. Keep building amazing things!`,
    projects: suggestions
  };
}

function generateBeginnerProjects(role) {
  const beginnerProjects = {
    frontend: [
      { name: 'Weather App', description: 'Fetch weather data and display with React', tech: ['React', 'API', 'CSS'] },
      { name: 'Todo List', description: 'Build a todo app with add/delete/edit features', tech: ['React', 'State Management'] },
      { name: 'Portfolio Website', description: 'Create your personal portfolio site', tech: ['HTML', 'CSS', 'JavaScript'] },
    ],
    backend: [
      { name: 'REST API CRUD', description: 'Build a simple CRUD API with Node + Express', tech: ['Node.js', 'Express', 'MongoDB'] },
      { name: 'Authentication API', description: 'User login/signup with JWT', tech: ['Node.js', 'JWT', 'MongoDB'] },
      { name: 'Blog API', description: 'Create a blog backend API', tech: ['Express', 'Database', 'REST'] },
    ],
    fullstack: [
      { name: 'Todo Application', description: 'Full-stack todo app with React + Node', tech: ['React', 'Node.js', 'MongoDB'] },
      { name: 'Chat App', description: 'Real-time messaging application', tech: ['React', 'Node.js', 'Socket.io'] },
      { name: 'Notes Application', description: 'Create/edit/delete notes with backend', tech: ['React', 'Express', 'MongoDB'] },
    ]
  };

  return beginnerProjects[role] || beginnerProjects.fullstack;
}

function generateIntermediateProjects(role) {
  const intermediateProjects = {
    frontend: [
      { name: 'E-commerce Store', description: 'Product catalog with cart functionality', tech: ['React', 'Redux', 'API'] },
      { name: 'Social Media Dashboard', description: 'Dashboard displaying multiple social feeds', tech: ['React', 'APIs', 'Charts'] },
      { name: 'Music Player', description: 'Spotify-like music player interface', tech: ['React', 'Audio API'] },
    ],
    backend: [
      { name: 'Email Service API', description: 'Send bulk emails with queue system', tech: ['Node.js', 'Queue', 'Email'] },
      { name: 'File Upload Service', description: 'Handle file uploads with cloud storage', tech: ['Express', 'AWS S3', 'Multer'] },
      { name: 'Payment Gateway Integration', description: 'Stripe/Razorpay integration', tech: ['Express', 'Payment API'] },
    ],
    fullstack: [
      { name: 'E-commerce Platform', description: 'Full e-commerce with payments', tech: ['MERN', 'Stripe', 'Authentication'] },
      { name: 'Social Network', description: 'Social media platform with posts/follows', tech: ['MERN', 'Real-time', 'Socket.io'] },
      { name: 'Project Management App', description: 'Collaboration tool with teams', tech: ['React', 'Node.js', 'MongoDB'] },
    ]
  };

  return intermediateProjects[role] || intermediateProjects.fullstack;
}

function generateAdvancedProjects(role) {
  const advancedProjects = {
    frontend: [
      { name: 'AI-powered Analytics Dashboard', description: 'ML-integrated data visualization', tech: ['React', 'TensorFlow.js', 'Charts'] },
      { name: 'Progressive Web App', description: 'Offline-capable PWA with service workers', tech: ['React', 'PWA', 'Service Workers'] },
      { name: 'Real-time Collaboration Tool', description: 'Like Google Docs with live editing', tech: ['React', 'WebSocket', 'Operational Transform'] },
    ],
    backend: [
      { name: 'Microservices Architecture', description: 'Build scalable microservices', tech: ['Docker', 'Kubernetes', 'Node.js'] },
      { name: 'Real-time Data Pipeline', description: 'Stream processing with Kafka/Redis', tech: ['Kafka', 'Redis', 'Node.js'] },
      { name: 'GraphQL API Server', description: 'Advanced GraphQL implementation', tech: ['GraphQL', 'Apollo', 'MongoDB'] },
    ],
    fullstack: [
      { name: 'AI-powered Recommendation Engine', description: 'ML recommendations with full-stack', tech: ['MERN', 'ML', 'Redis'] },
      { name: 'Serverless Microservices Platform', description: 'Cloud-native architecture', tech: ['AWS Lambda', 'React', 'DynamoDB'] },
      { name: 'Multi-tenant SaaS Application', description: 'Enterprise SaaS platform', tech: ['MERN', 'Multi-tenancy', 'Billing'] },
    ]
  };

  return advancedProjects[role] || advancedProjects.fullstack;
}

export default router;
