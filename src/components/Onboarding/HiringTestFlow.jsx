import React, { useState } from 'react';
import { AptitudeTest } from './AptitudeTest';
import { TechnicalRound } from './TechnicalRound';
import { HRRound } from './HRRound';
import { RiTrophyFill, RiCloseCircleFill, RiArrowRightUpLine, RiRefreshLine } from '@remixicon/react';

export const HiringTestFlow = ({ formData, onCompleteState }) => {
  const [step, setStep] = useState('intro'); 
  // steps: intro, aptitude, apt-result, technical, tech-result, hr, final-result
  
  const [aptScore, setAptScore] = useState(0);
  const [techScore, setTechScore] = useState(0);
  const [hrScore, setHrScore] = useState(0);

  const role = (formData.roles && formData.roles.length > 0) ? formData.roles[0] : "Frontend Developer";

  // --- Handlers ---
  const handleAptitudeComplete = (score) => {
    setAptScore(score);
    setStep('apt-result');
  };

  const handleTechComplete = (score) => {
    setTechScore(score);
    setStep('tech-result');
  };

  const handleHrComplete = (score) => {
    setHrScore(score);
    setStep('final-result');
  };

  // --- Global Stepper UI ---
  const renderStepper = (currentLayer) => {
    const steps = [
      { num: 1, label: "Aptitude", active: currentLayer >= 1, color: "blue" },
      { num: 2, label: "Technical", active: currentLayer >= 2, color: "indigo" },
      { num: 3, label: "HR", active: currentLayer >= 3, color: "purple" },
    ];
    return (
      <div className="flex items-center justify-center mb-8 gap-4 w-full max-w-3xl mx-auto px-4 z-10 relative">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center px-4 py-2 rounded-full font-bold text-sm transition-colors ${s.active ? `bg-${s.color}-600 text-white shadow-lg` : 'bg-gray-200 text-gray-500'}`}>
              Round {s.num}: {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-1 mx-2 rounded-full ${steps[i+1].active ? `bg-${s.color}-600` : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- Rendering ---
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-12 p-6 z-10 relative">
        {renderStepper(0)}
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-xl w-full mx-auto text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform">
            <RiTrophyFill size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Official Hiring Test</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Welcome to the ZYNKAR assessment pipeline. You will undergo 3 consecutive rounds.
            <br/><br/>
            <strong>Round 1:</strong> Aptitude Test (10 Mins)<br/>
            <strong>Round 2:</strong> {role} Technical Round (30 Mins)<br/>
            <strong>Round 3:</strong> HR Interview (15 Mins)<br/>
          </p>
          <button 
            onClick={() => setStep('aptitude')}
            className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/30 hover:-translate-y-1 transition-transform"
          >
            Start Round 1
          </button>
        </div>
      </div>
    );
  }

  // --- APTITUDE ---
  if (step === 'aptitude') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-10 px-4 sm:px-6 z-10 relative">
        {renderStepper(1)}
        <AptitudeTest onComplete={handleAptitudeComplete} />
      </div>
    );
  }

  if (step === 'apt-result') {
    // strict logic: score < 6 -> FAIL. score === 0 -> FAIL.
    const passed = aptScore >= 6 && aptScore !== 0;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-12 p-6 z-10 relative">
        {renderStepper(1)}
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
          {passed ? (
            <>
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiTrophyFill size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You passed Round 1 🎉</h2>
              <p className="text-gray-600 mb-8 text-sm">You scored {aptScore}/10 on the Aptitude Test. The next round evaluates your core Role logic.</p>
              <button 
                onClick={() => setStep('technical')}
                className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
              >
                Start Round 2 (Technical)
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiCloseCircleFill size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You failed Round 1 ❌</h2>
              <p className="text-gray-600 mb-8 font-medium">You scored {aptScore}/10. A minimum of 6 is required, however you may still proceed.</p>
              <button 
                onClick={() => setStep('technical')}
                className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
              >
                Continue to Round 2 (Technical) Anyway
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- TECHNICAL ---
  if (step === 'technical') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-10 px-4 sm:px-6 z-10 relative">
        {renderStepper(2)}
        <TechnicalRound role={role} onComplete={handleTechComplete} />
      </div>
    );
  }

  if (step === 'tech-result') {
    const passed = techScore >= 5; // Pass threshold for Tech
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-12 p-6 z-10 relative">
        {renderStepper(2)}
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
          {passed ? (
            <>
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiTrophyFill size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You passed Round 2 🚀</h2>
              <p className="text-gray-600 mb-8 text-sm">You successfully cleared the coding screen! One final behavioral step remaining.</p>
              <button 
                onClick={() => setStep('hr')}
                className="w-full py-4 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-600/30 hover:-translate-y-1 transition-transform"
              >
                Start HR Round
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiCloseCircleFill size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You failed Round 2 ❌</h2>
              <p className="text-gray-600 mb-4 font-medium">You scored {techScore}/10. However, you are permitted to continue to the final round.</p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 text-left">
                 <h4 className="font-bold text-gray-800 mb-2 text-sm">Suggested Improvements:</h4>
                 <ul className="text-sm text-gray-600 list-disc pl-5">
                   <li>Practice deeper {role} concepts</li>
                   <li>Build 2 more real-world projects</li>
                   <li>Enhance fundamental syntax capability</li>
                 </ul>
              </div>

              <button 
                onClick={() => setStep('hr')}
                className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
              >
                Continue to HR Round Anyway
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- HR ROUND ---
  if (step === 'hr') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-10 px-4 sm:px-6 z-10 relative">
        {renderStepper(3)}
        <HRRound onComplete={handleHrComplete} />
      </div>
    );
  }

  // --- FINAL RESULT (HR-RESULT) ---
  if (step === 'final-result') {
    const passed = hrScore >= 3; // Passed 3 out of 5 behavioral questions
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {passed && (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-200 blur-[120px] opacity-70 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-70 pointer-events-none"></div>
          </>
        )}
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-gray-100 relative z-10">
          {passed ? (
            <>
              <div className="w-28 h-28 bg-gradient-to-tr from-green-400 to-green-600 text-white rounded-3xl shadow-2xl shadow-green-500/40 flex items-center justify-center mx-auto mb-8 transform rotate-3">
                <RiTrophyFill size={56} />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                Congratulations 🎉 <br/> You are selected for Internship
              </h1>
              <p className="text-gray-600 mb-8 text-lg md:text-xl font-medium">
                You cleared all three strict rounds successfully.
              </p>
              
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-10 text-left">
                <h4 className="font-bold text-blue-900 mb-3 text-lg">Official Offer Message & Next Steps:</h4>
                <ul className="text-blue-800 space-y-3 font-medium">
                  <li className="flex items-center gap-2"><RiCheckDoubleFill className="text-blue-500"/> Check your email ({formData.email}) for the formal offer letter.</li>
                  <li className="flex items-center gap-2"><RiCheckDoubleFill className="text-blue-500"/> Schedule your onboarding call within 24 hours.</li>
                  <li className="flex items-center gap-2"><RiCheckDoubleFill className="text-blue-500"/> Join our internal Slack workspace workspace.</li>
                </ul>
              </div>

              <button 
                onClick={onCompleteState}
                className="w-full py-5 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
              >
                Accept & Go Home
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiCloseCircleFill size={48} />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Not selected</h2>
              <p className="text-gray-600 font-medium text-lg mb-8">You failed Round 3 ❌ (Culture Fit). Flow stopped.</p>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-left border mb-10 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">Improvement Tips:</h4>
                <ul className="text-gray-600 space-y-2 list-disc pl-5 font-medium">
                  <li>Use the STAR array method for behavioral questions</li>
                  <li>Expand your answers thoroughly (min. 15 words)</li>
                  <li>Incorporate stronger motivation drivers in your goals</li>
                </ul>
              </div>

              <button 
                onClick={onCompleteState}
                className="w-full flex justify-center items-center py-5 bg-gray-900 text-white font-bold text-xl rounded-2xl shadow-lg hover:-translate-y-1 transition-transform"
              >
                Return & Try Later
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};
