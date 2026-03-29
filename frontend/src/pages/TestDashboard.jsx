import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLock2Fill, RiCheckDoubleFill, RiTrophyFill, RiArrowRightLine, RiVipCrownFill, RiSecurePaymentLine, RiCloseLine } from '@remixicon/react';

export const TestDashboard = () => {
  const navigate = useNavigate();
  
  const [isPremium, setIsPremium] = useState(false);
  const [round1Passed, setRound1Passed] = useState(false);
  const [round2Passed, setRound2Passed] = useState(false);
  const [round3Passed, setRound3Passed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPremium(localStorage.getItem('isPremium') === 'true');
    setRound1Passed(localStorage.getItem('round1Passed') === 'true');
    setRound2Passed(localStorage.getItem('round2Passed') === 'true');
    setRound3Passed(localStorage.getItem('round3Passed') === 'true');
  }, []);

  const handleRoundClick = (roundId) => {
    if (roundId === 'round1') {
      navigate('/test/round1');
    } else {
      if (!isPremium) {
        navigate('/premium?redirect=tests');
      } else {
        navigate(`/test/${roundId}`);
      }
    }
  };

  const getStatus = (roundId) => {
    if (roundId === 'round1') {
      return round1Passed ? 'completed' : 'unlocked';
    }
    if (roundId === 'round2') {
      if (round2Passed) return 'completed';
      if (isPremium) return 'unlocked';
      return 'locked_premium';
    }
    if (roundId === 'round3') {
      if (round3Passed) return 'completed';
      if (isPremium) return 'unlocked';
      return 'locked_premium';
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === 'completed') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-lg border border-green-200">
          <RiCheckDoubleFill size={16} /> Completed 🎉
        </span>
      );
    }
    if (status === 'unlocked') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">
          <RiArrowRightLine size={16} /> Unlocked ✅
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-sm font-bold rounded-lg border border-red-200">
        <RiLock2Fill size={16} /> Locked 🔒
      </span>
    );
  };

  const roundsData = [
    {
      id: 'round1',
      title: 'Round 1',
      desc: 'Aptitude & Reasoning',
      details: '10 Questions • 10 Minutes',
      status: getStatus('round1')
    },
    {
      id: 'round2',
      title: 'Round 2',
      desc: 'DSA Coding',
      details: '5 Problems • 7 Minutes',
      status: getStatus('round2')
    },
    {
      id: 'round3',
      title: 'Round 3',
      desc: 'Advanced / Final Round',
      details: '5 Situational Questions • 5 Minutes',
      status: getStatus('round3')
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 rotate-3">
             <RiTrophyFill size={36} className="-rotate-3" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Assessment Hub</h1>
           <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
             Complete all three rigorously scoped rounds to generate your global ZYNKAR verification certificate and rank on the leaderboard.
           </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
        
        {/* Progress Timeline UI */}
        <div className="w-full max-w-3xl flex items-center justify-between mb-12 relative px-4 sm:px-12">
           <div className="absolute top-1/2 left-4 sm:left-12 right-4 sm:right-12 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
           <div 
             className="absolute top-1/2 left-4 sm:left-12 h-1 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-700 rounded-full"
             style={{ width: round3Passed ? '100%' : round2Passed ? '50%' : round1Passed ? '25%' : '0%' }}
           ></div>
           
           {[1, 2, 3].map((step) => {
             let active = false;
             if (step === 1) active = true;
             if (step === 2 && round1Passed) active = true;
             if (step === 3 && round2Passed) active = true;

             return (
               <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 font-black border-4 transition-all duration-500 ${
                 active ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-500/30' : 'bg-white text-gray-400 border-gray-100'
               }`}>
                 {step}
               </div>
             );
           })}
        </div>

        {/* Vertical Stack */}
        <div className="w-full max-w-3xl flex items-center flex-col gap-6">
          {roundsData.map((round, idx) => {
            const isLocked = round.status === 'locked' || round.status === 'locked_premium';
            const isCompleted = round.status === 'completed';
            
            return (
              <div 
                key={round.id}
                onClick={() => handleRoundClick(round.id)}
                className={`w-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 transition-all duration-300 cursor-pointer ${
                  isLocked 
                  ? 'border-red-100 hover:border-red-300 hover:shadow-lg' 
                  : isCompleted 
                    ? 'border-green-200 hover:border-green-300 hover:shadow-lg'
                    : 'border-blue-200 hover:border-blue-400 hover:-translate-y-1 hover:shadow-xl shadow-blue-500/10'
                }`}
              >
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                    isLocked ? 'bg-red-50 text-red-500' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">{round.title}</h2>
                    <p className="text-gray-900 font-bold mb-1">{round.desc}</p>
                    <p className="text-gray-500 text-sm font-medium">{round.details}</p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                  <StatusBadge status={round.status} />
                  {round.status === 'locked_premium' && (
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded w-max">Requires Premium ✨</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};
