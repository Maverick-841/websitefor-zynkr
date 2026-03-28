import React from 'react';

export const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full mt-6 mb-4">
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
        <span className="text-gray-700">Profile Completion</span>
        <span className="text-blue-600 font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {percentage < 100 ? (
        <p className="text-xs text-gray-500 mt-2">
          Complete your profile to unlock better opportunities!
        </p>
      ) : (
        <p className="text-xs text-green-600 font-medium mt-2">
          Your profile is fully complete!
        </p>
      )}
    </div>
  );
};
