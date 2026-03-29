import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiTrophyFill, RiMedalFill, RiTimeLine } from '@remixicon/react';

export const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile && userProfile.fullName) {
      setCurrentUser(userProfile.fullName);
    }

    try {
      const raw = JSON.parse(localStorage.getItem('globalLeaderboard')) || [];
      
      // Multi-tier sorting: 1) Round (Desc), 2) Score (Desc), 3) Time (Asc)
      const sorted = raw.sort((a, b) => {
        if (a.round !== b.round) return b.round - a.round;
        if (a.score !== b.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      // Filter to top 10 unique best scores per user (optional, showing all for now, slice 10)
      const top10 = sorted.slice(0, 10);
      setLeaders(top10);
      
    } catch(e) {
      setLeaders([]);
    }
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-[#111827] border-b border-gray-800 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between text-white">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition-colors">
            <RiArrowLeftLine /> Back to Home
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
             ZYNKAR <span className="text-yellow-500 bg-yellow-500/10 px-2 rounded flex items-center gap-1"><RiTrophyFill size={16}/> LEADERBOARD</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
        
        <div className="w-full max-w-4xl text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/20">
             <RiMedalFill size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Global Top Performers</h1>
          <p className="text-gray-500 font-medium text-lg">Ranked dynamically by Highest Round, Score, and Speed.</p>
        </div>

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm tracking-widest uppercase">
                  <th className="px-8 py-5 font-bold">Rank</th>
                  <th className="px-8 py-5 font-bold">Candidate</th>
                  <th className="px-8 py-5 font-bold">Max Round</th>
                  <th className="px-8 py-5 font-bold">Score</th>
                  <th className="px-8 py-5 font-bold text-right">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-medium text-lg">
                      No leaderboard data yet. Be the first to complete the assessment!
                    </td>
                  </tr>
                ) : (
                  leaders.map((node, index) => {
                    const isCurrent = currentUser && node.userName === currentUser;
                    return (
                      <tr 
                        key={index} 
                        className={`transition-colors hover:bg-gray-50 ${isCurrent ? 'bg-indigo-50/50 hover:bg-indigo-50/80' : ''}`}
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          {index === 0 ? <RiTrophyFill className="text-yellow-500" size={28} /> : 
                           index === 1 ? <RiTrophyFill className="text-gray-400" size={28} /> : 
                           index === 2 ? <RiTrophyFill className="text-amber-700" size={28} /> : 
                           <span className="text-gray-400 font-black text-xl w-7 text-center inline-block">#{index + 1}</span>}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                              {node.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className={`font-bold text-lg ${isCurrent ? 'text-indigo-900' : 'text-gray-900'}`}>{node.userName}</span>
                            {isCurrent && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">YOU</span>}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="px-4 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm">Round {node.round}</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="font-black text-xl text-gray-900">{node.score}</span>
                          <span className="text-gray-400 font-medium text-sm"> pts</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-600 font-medium">
                            <RiTimeLine size={18} className={index === 0 ? 'text-green-500' : 'text-gray-400'} /> 
                            {formatTime(node.timeTaken)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};
