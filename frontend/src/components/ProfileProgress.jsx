import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const ProfileProgress = () => {
  const [percentage, setPercentage] = useState(0);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          const user = JSON.parse(stored);
          const fields = ['name', 'email', 'phone', 'college', 'skills', 'resume'];
          let filledCount = 0;
          
          fields.forEach(field => {
            const val = user[field];
            // Name map since onboarding uses fullName
            if (field === 'name' && !val && user.fullName) {
              filledCount++;
            } else if (val && (typeof val === 'string' ? val.trim().length > 0 : Array.isArray(val) ? val.length > 0 : true)) {
              filledCount++;
            }
          });
          
          const calcPerc = Math.round((filledCount / fields.length) * 100);
          
          // Animate the progress linearly on mount
          setTimeout(() => {
             setPercentage(calcPerc);
          }, 100);

          setUserName(user.name || user.fullName || 'User');
        }
      } catch(e) {
        console.error("Error parsing userProfile");
      }
    };
    
    loadProfile();
    window.addEventListener('storage', loadProfile);
    window.addEventListener('profileUpdated', loadProfile);
    
    return () => {
      window.removeEventListener('storage', loadProfile);
      window.removeEventListener('profileUpdated', loadProfile);
    };
  }, []);

  const getColor = (perc) => {
    if (perc <= 40) return '#ef4444'; 
    if (perc <= 80) return '#eab308'; 
    return '#22c55e'; 
  };

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group relative hover:bg-gray-50 p-1.5 rounded-full transition-colors"
      onClick={() => navigate('/profile')}
    >
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
        Profile {percentage}% complete
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
      </div>

      <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: '28px',
            pathTransitionDuration: 1.5,
            pathColor: getColor(percentage),
            textColor: '#1f2937',
            trailColor: '#f3f4f6',
          })}
        />
      </div>
      
      {userName && (
        <span className="hidden sm:block font-bold text-gray-800 tracking-tight pr-2">
          {userName}
        </span>
      )}
    </div>
  );
};

export default ProfileProgress;
