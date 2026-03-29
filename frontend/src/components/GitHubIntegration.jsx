import React, { useState } from 'react';
import GitHubAnalysis from './GitHubAnalysis';

const GitHubIntegration = ({ gitHubUrl, onGitHubUrlChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    onGitHubUrlChange(url);
    if (url.includes('github.com')) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* GitHub URL Input */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          GitHub Profile <span className="text-gray-500">(Optional)</span>
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xl">🐙</span>
          <input
            type="url"
            placeholder="https://github.com/yourusername"
            value={gitHubUrl}
            onChange={handleUrlChange}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter your full GitHub profile URL to get personalized project recommendations
        </p>
      </div>

      {/* GitHub Analysis - Shows when URL is entered */}
      {gitHubUrl && isExpanded && (
        <div className="animate-in">
          <GitHubAnalysis gitHubUrl={gitHubUrl} />
        </div>
      )}
    </div>
  );
};

export default GitHubIntegration;
