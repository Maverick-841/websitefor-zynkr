import React, { useState, useEffect } from 'react';
import useGithubData from '../hooks/useGithubData';

const GitHubAnalysis = ({ gitHubUrl }) => {
  const { data, loading, error } = useGithubData(gitHubUrl);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('fullstack');

  useEffect(() => {
    if (data && data.username) {
      fetchSuggestions(selectedRole);
    }
  }, [data, selectedRole]);

  const fetchSuggestions = async (role) => {
    try {
      setSuggestionsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/github/${data.username}/suggestions?role=${role}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const result = await response.json();
      setSuggestions(result);
    } catch (err) {
      console.error('Suggestions fetch error:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const getPortfolioLevel = (count) => {
    if (count < 3) return { level: 'Beginner', color: 'bg-blue-500', badge: '🌱' };
    if (count < 6) return { level: 'Intermediate', color: 'bg-yellow-500', badge: '🌿' };
    return { level: 'Advanced', color: 'bg-green-500', badge: '🌳' };
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-spin"></div>
          <p className="text-gray-600">Analyzing GitHub profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">
          <span className="font-semibold">Error:</span> {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">Enter a GitHub URL to see analysis</p>
      </div>
    );
  }

  const portfolioInfo = getPortfolioLevel(data.count);

  return (
    <div className="w-full space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">GitHub Portfolio</h3>
            <p className="text-gray-600">@{data.username}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">{portfolioInfo.badge}</div>
            <span className={`${portfolioInfo.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              {portfolioInfo.level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Total Repositories</p>
            <p className="text-3xl font-bold text-blue-600">{data.count}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Total Stars</p>
            <p className="text-3xl font-bold text-purple-600">
              {data.repos?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Top Language</p>
            <p className="text-lg font-bold text-green-600">
              {data.repos?.[0]?.language || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Repositories List */}
      {data.repos && data.repos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Public Repositories ({data.repos.length})</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.repos.slice(0, 5).map((repo, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {repo.name}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{repo.description || 'No description'}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    {repo.language && <span>💻 {repo.language}</span>}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🔀 {repo.forks_count}</span>
                  </div>
                </div>
              </div>
            ))}
            {data.repos.length > 5 && (
              <p className="text-center text-gray-600 text-sm py-2">
                ...and {data.repos.length - 5} more repositories
              </p>
            )}
          </div>
        </div>
      )}

      {/* Project Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">
          {data.count < 3 ? '🎯' : data.count < 6 ? '📈' : '🚀'} Growth Recommendations
        </h4>

        <div className="mb-4 flex gap-2">
          {['frontend', 'backend', 'fullstack'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedRole === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {suggestionsLoading ? (
          <p className="text-gray-600">Loading suggestions...</p>
        ) : suggestions?.projects ? (
          <div className="space-y-3">
            {suggestions.projects.map((project, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
              >
                <h5 className="font-bold text-gray-800">{project.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Recommendation Message */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            {data.count < 3 && (
              <>
                <span className="font-semibold">📌 Starting Out?</span> Build foundational projects to establish your portfolio. Focus on completing projects from scratch and understanding core concepts.
              </>
            )}
            {data.count >= 3 && data.count < 6 && (
              <>
                <span className="font-semibold">📈 Building Momentum?</span> Add more complex features and collaborate on open-source projects. Increase project complexity and focus on specialization.
              </>
            )}
            {data.count >= 6 && (
              <>
                <span className="font-semibold">🌟 Impressive Portfolio!</span> Consider contributing to open-source, creating libraries, or mentoring others. Focus on impact and leadership.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitHubAnalysis;
