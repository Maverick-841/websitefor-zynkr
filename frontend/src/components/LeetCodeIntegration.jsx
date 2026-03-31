import React, { useState } from 'react';
import LeetCodeAnalysis from './LeetCodeAnalysis';

const LeetCodeIntegration = ({ leetCodeUrl, onLeetCodeUrlChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    onLeetCodeUrlChange(value);
    if (value.includes('leetcode.com')) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          LeetCode Profile 
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xl">🏆</span>
          <input
            type="url"
            placeholder="https://leetcode.com/u/yourusername/"
            value={leetCodeUrl}
            onChange={handleUrlChange}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter your LeetCode profile URL to get a DSA performance analysis and action plan.
        </p>
      </div>

      {leetCodeUrl && isExpanded && (
        <LeetCodeAnalysis leetcodeUrl={leetCodeUrl} showUrlInput={false} />
      )}
    </div>
  );
};

export default LeetCodeIntegration;
