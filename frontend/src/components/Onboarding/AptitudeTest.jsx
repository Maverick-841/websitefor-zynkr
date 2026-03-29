import React, { useState, useEffect } from 'react';
import { RiTimeLine, RiCheckboxCircleFill, RiArrowRightLine, RiArrowLeftLine } from '@remixicon/react';

const APTITUDE_QUESTIONS = [
  { id: 1, q: "What is the next number in the series: 2, 6, 12, 20, ...?", options: ["24", "28", "30", "32"], ans: "30" },
  { id: 2, q: "If A is the brother of B, and B is the sister of C. How is A related to C?", options: ["Brother", "Cousin", "Father", "Uncle"], ans: "Brother" },
  { id: 3, q: "Which word is an antonym for 'Benevolent'?", options: ["Kind", "Malevolent", "Generous", "Sympathetic"], ans: "Malevolent" },
  { id: 4, q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", options: ["120 metres", "180 metres", "324 metres", "150 metres"], ans: "150 metres" },
  { id: 5, q: "Find the odd one out.", options: ["Apple", "Mango", "Potato", "Grapes"], ans: "Potato" },
  { id: 6, q: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["100 minutes", "5 minutes", "25 minutes", "10 minutes"], ans: "5 minutes" },
  { id: 7, q: "Which of the following is correctly spelled?", options: ["Accomodate", "Accommodate", "Acommodate", "Accomodate"], ans: "Accommodate" },
  { id: 8, q: "If book is to reading, then fork is to:", options: ["Kitchen", "Eating", "Food", "Steak"], ans: "Eating" },
  { id: 9, q: "Solve: 15 + (5 x 2) - 3 = ?", options: ["22", "37", "40", "17"], ans: "22" },
  { id: 10, q: "Some months have 31 days, others have 30 days. How many have 28 days?", options: ["1", "6", "12", "None"], ans: "12" },
];

export const AptitudeTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      forceSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const forceSubmit = () => {
    let score = 0;
    APTITUDE_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.ans) score++;
    });
    onComplete(score);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const q = APTITUDE_QUESTIONS[currentIndex];
  const isLast = currentIndex === APTITUDE_QUESTIONS.length - 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 w-full max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aptitude Test</h2>
          <p className="text-gray-500 text-sm mt-1">Round 1: Quant, Logical & English</p>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
          <RiTimeLine size={20} /> <span className="text-xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress & Question */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Question {currentIndex + 1} of 10</span>
        <span className="text-sm font-bold text-blue-600">{Math.round(((currentIndex + 1)/10)*100)}%</span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-10 overflow-hidden">
        <div 
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{width: `${((currentIndex + 1)/10)*100}%`}}
        ></div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 mb-8 min-h-[300px] flex flex-col justify-center">
        <h3 className="font-bold text-xl text-gray-900 mb-8 leading-relaxed">
          {q.q}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {q.options.map((opt, i) => {
            const isSelected = answers[q.id] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(q.id, opt)}
                className={`text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between font-medium ${
                  isSelected 
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm transform -translate-y-0.5' 
                  : 'border-transparent bg-white hover:border-gray-300 text-gray-700 shadow-sm'
                }`}
              >
                <span>{opt}</span>
                {isSelected ? <RiCheckboxCircleFill className="text-blue-600 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0"></div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between pt-4">
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
            className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 transition-all"
          >
            Submit Test <RiCheckboxCircleFill />
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(APTITUDE_QUESTIONS.length - 1, prev + 1))}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/30 transition-all"
          >
            Next <RiArrowRightLine />
          </button>
        )}
      </div>

    </div>
  );
};
