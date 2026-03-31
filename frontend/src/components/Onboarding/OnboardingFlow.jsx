import React, { useState, useMemo } from 'react';
import { TextInput, SelectInput, MultiSelectInput } from './FormInputs';
import { RoleInterest } from './RoleInterest';
import { HiringTestFlow } from './HiringTestFlow';
import { ProgressBar } from './ProgressBar';
import { ProfileUpload } from './ProfileUpload';
import GitHubIntegration from '../GitHubIntegration';
import LeetCodeIntegration from '../LeetCodeIntegration';
import LinkedInIntegration from '../LinkedInIntegration';
import ResumeIntegration from '../ResumeIntegration';
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiFolderChartLine,
  RiCheckLine,
  RiArrowRightLine,
  RiCheckDoubleFill,
  RiLoader4Line,
  RiErrorWarningFill
} from '@remixicon/react';

const SKILLS_OPTIONS = [
  "HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "APIs", "TypeScript", "Express", "Tailwind CSS", "Next.js"
];

const LANGS_OPTIONS = ["JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP"];
const EXP_LEVELS = ["Fresher", "Beginner", "Intermediate", "Advanced"];
const GEN_OPTIONS = ["Male", "Female", "Other"];

export const OnboardingFlow = ({ onComplete, isEditMode }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = {
      fullName: '', phone: '', email: '', gender: '', dob: '', college: '', experienceLevel: '',
      roles: [], skills: [], languages: [], githubUrl: '', linkedinUrl: '', leetcodeUrl: '', resumeUrl: ''
    };
    try {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        return { ...defaults, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error(e);
    }
    return defaults;
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTestFlow, setShowTestFlow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - PDF only
    const allowedTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setResumeError('Only PDF format is allowed for resume upload');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setResumeError('File size exceeds 2MB limit');
      return;
    }

    setResumeError('');
    setIsUploadingResume(true);
    setResumeFile(file);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', file);

      const response = await fetch('http://localhost:5000/api/profile/upload-resume', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, resumeUrl: data.resumeUrl }));
      setResumeFileName(file.name);
      setIsUploadingResume(false);
    } catch (err) {
      console.error('Resume upload error:', err);
      setResumeError(err.message);
      setIsUploadingResume(false);
    }
  };

  const completionPercentage = useMemo(() => {
    let completed = 0;
    const coreFields = ['fullName', 'phone', 'email', 'gender', 'dob', 'experienceLevel'];

    coreFields.forEach(field => {
      if (formData[field] && formData[field].trim() !== '') completed += 3;
    });

    if (formData.roles && formData.roles.length > 0) completed += 10;
    if (formData.skills.length > 0) completed += 10;
    if (formData.languages.length > 0) completed += 10;

    // GitHub and LinkedIn are mandatory - 15 each
    if (formData.githubUrl && formData.githubUrl.includes('github.com')) completed += 13;
    if (formData.linkedinUrl && formData.linkedinUrl.includes('linkedin.com')) completed += 13;
    
    // Resume is mandatory - 20
    if (formData.resumeUrl) completed += 20;
    
    // LeetCode is optional - 6
    if (formData.leetcodeUrl) completed += 6;

    return Math.min(completed, 100);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isUploadingResume) {
      setErrorMsg("Resume upload is in progress. Please wait before proceeding.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (resumeError) {
      setErrorMsg("Please fix the resume upload error before proceeding.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const requiredFields = ['fullName', 'phone', 'email', 'gender', 'dob', 'experienceLevel'];
    
    // Validate required fields explicitly
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
         setErrorMsg(`Please fill out the missing core field: ${field}`);
         window.scrollTo({ top: 0, behavior: 'smooth' });
         return;
      }
    }

    if (!formData.roles || formData.roles.length === 0) {
      setErrorMsg("Please select at least one Role Interest.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.skills || formData.skills.length === 0) {
      setErrorMsg("Please select your Key Skills.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.languages || formData.languages.length === 0) {
      setErrorMsg("Please select your Programming Languages.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.githubUrl || formData.githubUrl.trim() === '') {
      setErrorMsg("GitHub URL is mandatory. Please provide your GitHub profile link.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.githubUrl.includes('github.com')) {
      setErrorMsg("Please enter a valid GitHub URL (e.g., https://github.com/username)");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.linkedinUrl || formData.linkedinUrl.trim() === '') {
      setErrorMsg("LinkedIn URL is mandatory. Please provide your LinkedIn profile link.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.linkedinUrl.includes('linkedin.com')) {
      setErrorMsg("Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.resumeUrl || formData.resumeUrl.trim() === '') {
      setErrorMsg("Resume upload is mandatory. Please upload your resume (PDF only).");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isEditMode) {
      setIsSaved(true);
    } else {
      setIsAnalyzing(true);
    }
    
    try {
      const payload = {
        ...formData,
        interestRoles: formData.roles,
        profileCompletion: completionPercentage
      };

      console.log('[Onboarding] Saving profile with payload:', {
        userId: formData._id || 'new-user',
        fullName: formData.fullName,
        email: formData.email,
        roles: formData.roles,
        interestRoles: payload.interestRoles,
        skills: formData.skills.length,
        languages: formData.languages.length,
        resumeUrl: formData.resumeUrl ? 'present' : 'missing'
      });

      const response = await fetch('http://localhost:5000/api/profile/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('[Onboarding] Save failed:', responseData);
        throw new Error(responseData.message || 'Failed to save user profile');
      }

      console.log('[Onboarding] ✓ Profile saved successfully:', responseData);

      const savedUser = responseData?.user ? responseData.user : payload;

      // Save locally as well for other components
      localStorage.setItem('userProfile', JSON.stringify(savedUser));

      if (isEditMode) {
        setTimeout(() => {
          setIsSaved(false);
          if (onComplete) onComplete(savedUser);
        }, 800);
        return;
      }

      // Skip AI report and continue directly after save
      setTimeout(() => {
        setIsAnalyzing(false);
        if (onComplete) onComplete(savedUser);
      }, 800);

    } catch (err) {
      console.error('Error saving profile:', err);
      setIsAnalyzing(false);
      setIsSaved(false);
      setErrorMsg("Failed to save profile: " + err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (showTestFlow) {
    return (
      <HiringTestFlow 
        formData={formData}
        onCompleteState={() => {
          setShowTestFlow(false);
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            if (onComplete) onComplete(formData);
          }, 2000);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      
      {/* AI Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full border border-gray-100 transform scale-105 animate-fade-in-up">
            <RiLoader4Line size={64} className="text-blue-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">Analyzing your profile with AI...</h3>
            <p className="text-gray-500 font-medium animate-pulse">Please wait (5 seconds)</p>
          </div>
        </div>
      )}

      {/* Soft gradient background accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-100 blur-[80px] opacity-50 pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-5 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          {/* Fallback avatar/logo if normal one isn't available */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-800">ZYNKAR</span>
        </div>
        <button
          onClick={() => onComplete && onComplete(formData)}
          className="text-gray-500 font-medium hover:text-gray-800 text-sm transition-colors"
        >
          Back
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 relative z-10">

        {/* Left Side: Profile Indicator */}
        <aside className="lg:w-1/3 w-full shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center hover:shadow-md transition-shadow">
            <ProfileUpload />
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {formData.fullName || "Your Name"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {formData.experienceLevel ? `${formData.experienceLevel} Professional` : "Update your role"}
            </p>
            <ProgressBar percentage={completionPercentage} />
          </div>

          {/* Suggestions Panel on larger screens typically, moved left or right based on design. Putting it here keeps UI balanced */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">Complete Your Profile</h3>
            <ul className="space-y-4">
              <li className={`flex items-start gap-3 ${formData.skills.length > 0 ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.skills.length > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                  {formData.skills.length > 0 ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-blue-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Add Key Skills</p>
                  <p className="text-xs text-gray-500 mt-0.5">+12% Completion</p>
                </div>
              </li>
              <li className={`flex items-start gap-3 ${formData.experienceLevel ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.experienceLevel ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                  {formData.experienceLevel ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-blue-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Set Experience Level</p>
                  <p className="text-xs text-gray-500 mt-0.5">+4% Completion</p>
                </div>
              </li>
              <li className={`flex items-start gap-3 ${formData.githubUrl && formData.githubUrl.includes('github.com') ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.githubUrl && formData.githubUrl.includes('github.com') ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {formData.githubUrl && formData.githubUrl.includes('github.com') ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-red-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Add GitHub Profile <span className="text-red-500 font-bold">*</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">+15% Completion (Mandatory)</p>
                </div>
              </li>
              <li className={`flex items-start gap-3 ${formData.linkedinUrl && formData.linkedinUrl.includes('linkedin.com') ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.linkedinUrl && formData.linkedinUrl.includes('linkedin.com') ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {formData.linkedinUrl && formData.linkedinUrl.includes('linkedin.com') ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-red-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Add LinkedIn Profile <span className="text-red-500 font-bold">*</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">+15% Completion (Mandatory)</p>
                </div>
              </li>
              <li className={`flex items-start gap-3 ${formData.leetcodeUrl ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.leetcodeUrl ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                  {formData.leetcodeUrl ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-blue-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Add LeetCode (Optional)</p>
                  <p className="text-xs text-gray-500 mt-0.5">+6% Completion</p>
                </div>
              </li>
              <li className={`flex items-start gap-3 ${formData.resumeUrl ? 'opacity-50' : ''}`}>
                <div className={`mt-0.5 p-1 rounded-full ${formData.resumeUrl ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {formData.resumeUrl ? <RiCheckLine size={14} /> : <div className="w-3.5 h-3.5 m-0.5 rounded-full bg-red-500"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Upload Resume <span className="text-red-500 font-bold">*</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">+20% Completion (Mandatory)</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Side: Form */}
        <section className="lg:w-2/3 w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{isEditMode ? "Edit your ZYNKAR Profile" : "Build your ZYNKAR Profile"}</h1>
              <p className="text-gray-500 text-sm sm:text-base">Complete your profile to land your dream role.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200 mb-6 flex items-center gap-2">
                  <RiErrorWarningFill size={18} /> {errorMsg}
                </div>
              )}

              {/* Basic Details Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <TextInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                  <TextInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  <TextInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                  <SelectInput label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={GEN_OPTIONS} />
                  <TextInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                  <TextInput label="College / University" name="college" value={formData.college} onChange={handleChange} placeholder="E.g., IIT Delhi, Stanford" />
                  <SelectInput label="Experience Level" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} options={EXP_LEVELS} />
                </div>
              </div>

              {/* Role Interest Section */}
              <RoleInterest selectedRoles={formData.roles || []} onChange={handleChange} />

              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Skills & Expertise</h3>
                <MultiSelectInput label="Key Skills (Select multiple)" name="skills" selectedValues={formData.skills} onChange={handleChange} options={SKILLS_OPTIONS} />
                <MultiSelectInput label="Programming Languages" name="languages" selectedValues={formData.languages} onChange={handleChange} options={LANGS_OPTIONS} />
              </div>

              {/* Links Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Web Presence</h3>
                
                {/* GitHub Integration with Analysis */}
                <div className="mb-6">
                  <GitHubIntegration 
                    gitHubUrl={formData.githubUrl}
                    onGitHubUrlChange={(url) => handleChange({ target: { name: 'githubUrl', value: url } })}
                  />
                </div>

                {/* LeetCode Integration with Analysis */}
                <div className="mb-6">
                  <LeetCodeIntegration
                    leetCodeUrl={formData.leetcodeUrl}
                    onLeetCodeUrlChange={(url) => handleChange({ target: { name: 'leetcodeUrl', value: url } })}
                  />
                </div>

                {/* LinkedIn Integration */}
                <div className="mb-6">
                  <LinkedInIntegration
                    linkedInUrl={formData.linkedinUrl}
                    onLinkedInUrlChange={(url) => handleChange({ target: { name: 'linkedinUrl', value: url } })}
                  />
                </div>

                {/* Resume Integration */}
                <div className="mb-6">
                  <ResumeIntegration
                    resumeUrl={formData.resumeUrl}
                    resumeFileName={resumeFileName}
                    isUploadingResume={isUploadingResume}
                    resumeError={resumeError}
                    onResumeUpload={handleResumeUpload}
                    selectedRole={(formData.roles && formData.roles[0]) ? formData.roles[0].toLowerCase() : 'fullstack'}
                  />
                </div>

              </div>

              {/* Extras - Buttons mapped to fake interactions or expansions if needed */}

              {/* Submission */}
              <div className="pt-6 mt-6 border-t flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onComplete && onComplete(formData)}
                  className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaved || isUploadingResume || isAnalyzing}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isSaved
                      ? "bg-green-500 hover:bg-green-600 shadow-green-500/30 scale-105"
                      : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/30"
                    }`}
                >
                  {isSaved ? (
                    <>
                      <RiCheckDoubleFill size={20} className="animate-pulse" />
                      Profile Saved!
                    </>
                  ) : (
                    <>
                      {isUploadingResume ? "Uploading Resume..." : (isEditMode ? "Save Profile" : "Save & Continue")}
                      {!isEditMode && <RiArrowRightLine size={18} />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
