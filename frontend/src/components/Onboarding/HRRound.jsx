import React, { useState, useEffect } from 'react';
import { RiTimeLine, RiQuestionAnswerLine, RiArrowRightLine, RiArrowLeftLine, RiCheckDoubleFill } from '@remixicon/react';

const HR_QUESTIONS = [
  { id: 1, q: "Tell me about yourself, your background, and your journey so far." },
  { id: 2, q: "Why should we hire you for this specific internship role over other candidates?" },
  { id: 3, q: "What do you consider your greatest technical strength, and your biggest weakness?" },
  { id: 4, q: "Describe a time you faced a difficult challenge or a bug in a project. How did you overcome it?" },
  { id: 5, q: "Where do you see yourself and your career in the next 3 to 5 years?" }
];

export const HRRound = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  
  useEffect(() => {
    if (timeLeft <= 0) {
      forceSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e) => {
    setAnswers(prev => ({ ...prev, [HR_QUESTIONS[currentIndex].id]: e.target.value }));
  };

  const forceSubmit = () => {
    // Basic mock evaluation logic: check length of behavioral answers
    let score = 0;
    HR_QUESTIONS.forEach(q => {
      const response = answers[q.id] || "";
      if (response.trim().split(" ").length >= 15) score++; // At least 15 words per answer
    });
    onComplete(score);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const q = HR_QUESTIONS[currentIndex];
  const isLast = currentIndex === HR_QUESTIONS.length - 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 w-full max-w-4xl mx-auto mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HR Interview Round</h2>
          <p className="text-gray-500 text-sm mt-1">Round 3: Behavioral & Culture Fit</p>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-purple-50 text-purple-700'}`}>
          <RiTimeLine size={20} /> <span className="text-xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Question {currentIndex + 1} of 5</span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
        <div 
          className="bg-purple-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{width: `${((currentIndex + 1)/5)*100}%`}}
        ></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 min-h-[300px]">
        
        {/* Left: Prompt */}
        <div className="lg:col-span-2 bg-purple-50/50 border border-purple-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiQuestionAnswerLine className="text-purple-600" />
            <h3 className="font-bold text-purple-900">Interview Question</h3>
          </div>
          <p className="text-gray-900 text-lg leading-relaxed font-semibold">
            {q.q}
          </p>
          <div className="mt-8 pt-6 border-t border-purple-100/50">
             <p className="text-sm text-purple-600 font-medium">Tip: Be authentic. Use the STAR method (Situation, Task, Action, Result) if applicable.</p>
          </div>
        </div>

        {/* Right: Answer Area */}
        <div className="lg:col-span-3">
          <textarea
            value={answers[q.id] || ""}
            onChange={handleChange}
            placeholder="Type your answer here... (Aim for at least 2-3 sentences)"
            className="w-full h-full min-h-[250px] p-6 bg-white text-gray-800 font-sans text-[15px] leading-relaxed rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 resize-none transition-all shadow-sm"
          ></textarea>
        </div>

      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-6">
        <button 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all ${currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <RiArrowLeftLine /> Previous
        </button>

        {isLast ? (
          <button 
            onClick={forceSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 transition-all"
          >
            Submit Interview <RiCheckDoubleFill />
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(HR_QUESTIONS.length - 1, prev + 1))}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/30 transition-all"
          >
            Next Question <RiArrowRightLine />
          </button>
        )}
      </div>

    </div>
  );
};
