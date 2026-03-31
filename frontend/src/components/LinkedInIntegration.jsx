import React from 'react';

const LinkedInIntegration = ({ linkedInUrl, onLinkedInUrlChange }) => {
  const handleChange = (e) => {
    onLinkedInUrlChange(e.target.value);
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          LinkedIn Profile <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xl">💼</span>
          <input
            type="url"
            placeholder="https://linkedin.com/in/yourusername"
            value={linkedInUrl}
            onChange={handleChange}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Add your LinkedIn profile URL for professional visibility and profile completeness.
        </p>
      </div>
    </div>
  );
};

export default LinkedInIntegration;
