import React from 'react';
import { 
  RiLayoutLine, 
  RiServerLine, 
  RiStackLine, 
  RiReactjsLine, 
  RiCupLine, 
  RiCodeBoxLine, 
  RiBarChartLine, 
  RiBrainLine, 
  RiRobot2Line, 
  RiSettings4Line, 
  RiShieldKeyholeLine, 
  RiCloudLine, 
  RiSmartphoneLine, 
  RiPaletteLine 
} from '@remixicon/react';

const ROLE_OPTIONS = [
  { id: 'frontend', label: 'Frontend Developer', icon: RiLayoutLine },
  { id: 'backend', label: 'Backend Developer', icon: RiServerLine },
  { id: 'fullstack', label: 'Full Stack Developer', icon: RiStackLine },
  { id: 'mern', label: 'MERN Stack Developer', icon: RiReactjsLine },
  { id: 'java', label: 'Java Developer', icon: RiCupLine },
  { id: 'python', label: 'Python Developer', icon: RiCodeBoxLine },
  { id: 'da', label: 'Data Analyst', icon: RiBarChartLine },
  { id: 'ds', label: 'Data Scientist', icon: RiBrainLine },
  { id: 'aiml', label: 'AI / ML Engineer', icon: RiRobot2Line },
  { id: 'devops', label: 'DevOps Engineer', icon: RiSettings4Line },
  { id: 'cyber', label: 'Cybersecurity Analyst', icon: RiShieldKeyholeLine },
  { id: 'cloud', label: 'Cloud Engineer', icon: RiCloudLine },
  { id: 'mobile', label: 'Mobile App Developer', icon: RiSmartphoneLine },
  { id: 'uiux', label: 'UI/UX Designer', icon: RiPaletteLine },
];

export const RoleInterest = ({ selectedRoles = [], onChange, required }) => {
  const toggleRole = (roleLabel) => {
    let newRoles;
    if (selectedRoles.includes(roleLabel)) {
      newRoles = selectedRoles.filter(r => r !== roleLabel);
    } else {
      newRoles = [...selectedRoles, roleLabel];
    }
    onChange({ target: { name: 'roles', value: newRoles } });
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-800 mb-3">
        Role Interest {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ROLE_OPTIONS.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRoles.includes(role.label);
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => toggleRole(role.label)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-300 transform active:scale-95 ${
                isSelected 
                ? 'bg-blue-50 border-blue-500 shadow-sm shadow-blue-100 ring-2 ring-blue-500/20 text-blue-700 -translate-y-1' 
                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-1 text-gray-600 shadow-sm'
              }`}
            >
              <Icon size={24} className={`mb-2 transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                {role.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
