import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLock2Fill, RiCheckDoubleFill, RiTrophyFill, RiArrowRightLine, RiBarChartBoxLine, RiMedalLine, RiStackLine } from '@remixicon/react';

export const TestDashboard = () => {
  const navigate = useNavigate();

  const [round1Passed, setRound1Passed] = useState(false);
  const [round2Passed, setRound2Passed] = useState(false);
  const [round3Passed, setRound3Passed] = useState(false);
  const [scoreStats, setScoreStats] = useState({
    attempts: 0,
    totalBestScore: 0,
    completionPercent: 0,
    round1Best: 0,
    round2Best: 0,
    round3Best: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setRound1Passed(localStorage.getItem('round1Passed') === 'true');
    setRound2Passed(localStorage.getItem('round2Passed') === 'true');
    setRound3Passed(localStorage.getItem('round3Passed') === 'true');

    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
      const currentUserName = userProfile.fullName || 'Guest User';
      const rawLeaderboard = JSON.parse(localStorage.getItem('globalLeaderboard')) || [];

      const myAttempts = rawLeaderboard.filter((row) => row.userName === currentUserName);
      const bestByRound = {
        1: 0,
        2: 0,
        3: 0,
      };

      myAttempts.forEach((row) => {
        if (row.round >= 1 && row.round <= 3) {
          bestByRound[row.round] = Math.max(bestByRound[row.round], Number(row.score) || 0);
        }
      });

      const totalBestScore = bestByRound[1] + bestByRound[2] + bestByRound[3];
      const completionPercent = Math.round((totalBestScore / 20) * 100);

      setScoreStats({
        attempts: myAttempts.length,
        totalBestScore,
        completionPercent,
        round1Best: bestByRound[1],
        round2Best: bestByRound[2],
        round3Best: bestByRound[3],
      });
    } catch (error) {
      setScoreStats({
        attempts: 0,
        totalBestScore: 0,
        completionPercent: 0,
        round1Best: 0,
        round2Best: 0,
        round3Best: 0,
      });
    }
  }, []);

  const handleRoundClick = (roundId) => {
    if (roundId === 'round1') {
      navigate('/test/round1');
      return;
    }

    if (roundId === 'round2') {
      if (!round1Passed) return;
      navigate('/test/round2');
      return;
    }

    if (roundId === 'round3') {
      if (!round2Passed) return;
      navigate('/test/round3');
    }
  };

  const getStatus = (roundId) => {
    if (roundId === 'round1') {
      return round1Passed ? 'completed' : 'unlocked';
    }
    if (roundId === 'round2') {
      if (round2Passed) return 'completed';
      return round1Passed ? 'unlocked' : 'locked';
    }
    if (roundId === 'round3') {
      if (round3Passed) return 'completed';
      return round2Passed ? 'unlocked' : 'locked';
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

  const getRankLabel = (percent) => {
    if (percent >= 85) return 'Expert';
    if (percent >= 65) return 'Advanced';
    if (percent >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getRankStyles = (rank) => {
    if (rank === 'Expert') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (rank === 'Advanced') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rank === 'Intermediate') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const rankLabel = getRankLabel(scoreStats.completionPercent);

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

        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-2">
              <RiStackLine size={18} /> Total Best Score
            </div>
            <div className="text-3xl font-black text-gray-900">{scoreStats.totalBestScore}<span className="text-lg text-gray-400">/20</span></div>
            <p className="text-xs text-gray-500 mt-1">Best across all 3 rounds</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-2">
              <RiBarChartBoxLine size={18} /> Completion Score
            </div>
            <div className="text-3xl font-black text-blue-700">{scoreStats.completionPercent}%</div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getRankStyles(rankLabel)}`}>
                Rank: {rankLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Overall project test readiness</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-2">
              <RiMedalLine size={18} /> Attempts Logged
            </div>
            <div className="text-3xl font-black text-emerald-700">{scoreStats.attempts}</div>
            <p className="text-xs text-gray-500 mt-1">Your completed test submissions</p>
          </div>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm mb-10">
          <h3 className="text-lg font-black text-gray-900 mb-4">Round-wise Best Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs font-bold text-blue-700 mb-1">Round 1</p>
              <p className="text-2xl font-black text-blue-900">{scoreStats.round1Best}<span className="text-sm text-blue-500">/10</span></p>
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
              <p className="text-xs font-bold text-indigo-700 mb-1">Round 2</p>
              <p className="text-2xl font-black text-indigo-900">{scoreStats.round2Best}<span className="text-sm text-indigo-500">/5</span></p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-xs font-bold text-emerald-700 mb-1">Round 3</p>
              <p className="text-2xl font-black text-emerald-900">{scoreStats.round3Best}<span className="text-sm text-emerald-500">/5</span></p>
            </div>
          </div>
        </div>
        
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
            const isLocked = round.status === 'locked';
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
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};
