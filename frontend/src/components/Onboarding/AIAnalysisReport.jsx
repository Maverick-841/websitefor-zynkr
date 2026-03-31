import React from 'react';
import { 
  RiGithubFill, 
  RiLinkedinFill, 
  RiCodeBoxLine, 
  RiFileList3Line, 
  RiCheckboxCircleFill, 
  RiErrorWarningFill, 
  RiCloseCircleFill,
  RiArrowRightUpLine,
  RiLightbulbFlashLine,
  RiRobot2Line
} from '@remixicon/react';

export const AIAnalysisReport = ({ formData, onImprove, onStartTest }) => {
  // 1. Role-based Skill Check
  const role = formData.roles && formData.roles.length > 0 ? formData.roles[0] : "Frontend Developer";
  const userSkills = formData.skills || [];
  
  let recommendedSkills = [];
  if (role.toLowerCase().includes("frontend") || role.toLowerCase().includes("mern") || role.toLowerCase().includes("full stack") || role.toLowerCase().includes("ui")) {
    recommendedSkills = ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS"];
  } else if (role.toLowerCase().includes("backend") || role.toLowerCase().includes("java") || role.toLowerCase().includes("python")) {
    recommendedSkills = ["Node.js", "Express", "MongoDB", "Python", "Java", "SQL", "APIs"];
  } else if (role.toLowerCase().includes("data") || role.toLowerCase().includes("ai") || role.toLowerCase().includes("ml")) {
    recommendedSkills = ["Python", "SQL", "Excel", "Data Analytics", "Machine Learning"];
  } else {
    recommendedSkills = ["JavaScript", "Git", "APIs"];
  }

  const missingSkills = recommendedSkills.filter(skill => !userSkills.includes(skill));
  const hasMissingSkills = missingSkills.length > 0;

  // Analysis Data
  const githubLinked = !!formData.githubUrl;
  const linkedinLinked = !!formData.linkedinUrl;
  const leetcodeLinked = !!formData.leetcodeUrl;

  const StatusIcon = ({ status }) => {
    if (status === 'good') return <RiCheckboxCircleFill className="text-green-500 w-5 h-5 flex-shrink-0" />;
    if (status === 'warning') return <RiErrorWarningFill className="text-yellow-500 w-5 h-5 flex-shrink-0" />;
    return <RiCloseCircleFill className="text-red-500 w-5 h-5 flex-shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-x-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-70 pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-100 blur-[80px] opacity-50 pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Header Record */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10"></div>
          
          <div className="flex items-center gap-6 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 text-white animate-pulse flex-shrink-0">
              <RiRobot2Line className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">AI Profile Analysis</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Generated targeting <span className="font-semibold text-gray-700">{role}</span></p>
            </div>
          </div>
          
          <div className="text-center sm:text-right flex flex-col items-center sm:items-end w-full sm:w-auto mt-4 sm:mt-0 bg-gray-50 p-4 sm:p-0 sm:bg-transparent rounded-xl">
            <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Profile Strength</span>
            <div className="flex items-end gap-1">
              <span className="text-4xl sm:text-5xl font-black text-blue-600 leading-none">65</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">%</span>
            </div>
            <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Actionable Suggestions (Top Priority) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 sm:p-10 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 border-b border-gray-700 pb-4">
            <RiLightbulbFlashLine className="text-yellow-400 w-8 h-8" />
            <h2 className="text-2xl font-bold">Action Plan to Hit 100%</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">1</div>
              <span className="text-gray-300 text-sm font-medium">Add 3 more real-world projects</span>
            </li>
            {hasMissingSkills && (
              <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">2</div>
                <span className="text-gray-300 text-sm font-medium">Improve {missingSkills.slice(0, 2).join(" & ")} skills</span>
              </li>
            )}
            <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">3</div>
              <span className="text-gray-300 text-sm font-medium">Solve 50 medium DSA problems</span>
            </li>
            <li className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">4</div>
              <span className="text-gray-300 text-sm font-medium">Update resume & add measurable metrics</span>
            </li>
          </ul>
        </div>

        {/* Detailed Report Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* 1. Skill Check */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><RiCodeBoxLine size={20}/></div>
              <h3 className="text-lg font-bold text-gray-900">Role-based Skill Check</h3>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col">
              <p className="text-sm text-gray-800 font-medium mb-3">For <span className="text-blue-600 font-bold">{role}</span>, you should know:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendedSkills.map(s => <span key={s} className={`px-2.5 py-1 bg-white border ${userSkills.includes(s) ? 'border-green-200 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600'} rounded text-xs font-medium shadow-sm`}>{s}</span>)}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-200">
                {hasMissingSkills ? (
                  <div className="flex items-start gap-2 text-sm">
                    <StatusIcon status="warning" />
                    <p className="text-gray-700"><span className="font-bold text-gray-900">You are missing:</span> {missingSkills.join(", ")}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <StatusIcon status="good" /> You have the recommended baseline skills!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. GitHub Check */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-sm"><RiGithubFill size={20}/></div>
              <h3 className="text-lg font-bold text-gray-900">GitHub Analysis</h3>
            </div>
            <div className={`flex-1 rounded-2xl p-5 border flex items-center ${githubLinked ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-4">
                <StatusIcon status={githubLinked ? "warning" : "error"} />
                <div>
                  <h4 className={`font-bold text-[15px] mb-1.5 ${githubLinked ? 'text-yellow-900' : 'text-red-900'}`}>
                    {githubLinked ? "Your GitHub has only 2 projects." : "GitHub profile is missing"}
                  </h4>
                  <p className={`text-sm leading-relaxed ${githubLinked ? 'text-yellow-800' : 'text-red-800'}`}>
                    {githubLinked ? "Add more real-world projects. Evaluators look at code quality and contribution frequency." : "Linking a GitHub profile is an absolute necessity for developers."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. LeetCode / DSA */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black !text-xl shadow-sm">L</div>
              <h3 className="text-lg font-bold text-gray-900">LeetCode / DSA</h3>
            </div>
            <div className={`flex-1 rounded-2xl p-5 border flex items-center ${leetcodeLinked ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-4">
                <StatusIcon status={leetcodeLinked ? "warning" : "error"} />
                <div>
                  <h4 className={`font-bold text-[15px] mb-1.5 ${leetcodeLinked ? 'text-yellow-900' : 'text-red-900'}`}>
                    {leetcodeLinked ? "Good progress, but focus on Mediums." : "No DSA profile attached"}
                  </h4>
                  <p className={`text-sm leading-relaxed ${leetcodeLinked ? 'text-yellow-800' : 'text-red-800'}`}>
                    {leetcodeLinked ? "You solved mostly easy problems. Try tackling medium-level algorithms to pass standard tech interviews." : "Data Structures and Algorithms are critical to clearing initial tech screens."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. LinkedIn & Resume */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><RiLinkedinFill size={24}/></div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">LinkedIn Profile</h3>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <StatusIcon status={linkedinLinked ? "good" : "error"} /> 
                    {linkedinLinked ? <span className="text-green-700">LinkedIn profile looks good</span> : <span className="text-red-700">Create a LinkedIn profile</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-start flex-col justify-center hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><RiFileList3Line size={20}/></div>
                <h3 className="text-base font-bold text-gray-900">Resume Feedback</h3>
               </div>
               <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full shadow-sm">
                 <div className="flex items-center gap-2 mb-2.5">
                    <StatusIcon status="error" />
                    <span className="text-[15px] font-bold text-red-900">Your resume needs improvement</span>
                 </div>
                 <ul className="text-sm text-red-800 space-y-1.5 list-disc pl-8 font-medium">
                   <li>Add measurable achievements</li>
                   <li>Add impactful projects</li>
                   <li>Improve formatting (make it ATS-friendly)</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          <button 
            onClick={onImprove}
            className="px-8 py-5 bg-white border border-gray-200 text-gray-800 text-lg font-bold rounded-2xl shadow-sm hover:bg-gray-50 flex items-center justify-center w-full sm:w-auto transition-colors"
          >
            Improve My Profile
          </button>

          {onStartTest && (
            <button 
              onClick={onStartTest}
              className="px-8 py-5 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-sm hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto transition-colors"
            >
              Continue to Next Step
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
