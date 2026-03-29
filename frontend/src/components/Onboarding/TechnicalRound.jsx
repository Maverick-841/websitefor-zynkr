import React, { useState, useEffect } from 'react';
import { RiTimeLine, RiCodeBoxLine, RiArrowRightLine, RiArrowLeftLine, RiCheckDoubleFill } from '@remixicon/react';

const QUESTIONS = {
  frontend: [
    { id: 1, type: "code", q: "Create a functional React component that implements a counter spanning 0 to 10." },
    { id: 2, type: "logic", q: "Explain how React's Virtual DOM improves rendering performance compared to direct DOM manipulation." },
    { id: 3, type: "code", q: "Write a utility function in JavaScript that deeply clones a nested object without using external libraries." },
    { id: 4, type: "logic", q: "Describe the differences between CSS Grid and Flexbox. When would you use one over the other?" },
    { id: 5, type: "code", q: "Write a React hook to fetch data from a given API URL and handle loading and error states." },
    { id: 6, type: "logic", q: "What is event delegation in JavaScript and why is it useful?" },
    { id: 7, type: "code", q: "Implement a responsive navigation bar layout using purely Tailwind CSS classes." },
    { id: 8, type: "logic", q: "Explain the concept of closures in JavaScript with a simple real-world analogy." },
    { id: 9, type: "code", q: "Write a function that debounces a search input callback to execute only after 500ms of inactivity." },
    { id: 10, type: "logic", q: "How does the Context API compare to Redux/Zustand for state management?" },
  ],
  backend: [
    { id: 1, type: "code", q: "Write a basic Express.js server that listens on port 3000 and returns 'Hello World' on the root route." },
    { id: 2, type: "logic", q: "Explain the differences between REST and GraphQL." },
    { id: 3, type: "code", q: "Write a Mongoose schema model for a 'User' containing name, email (unique), and encrypted password." },
    { id: 4, type: "logic", q: "What is middleware in Node.js? Detail how an auth barrier works." },
    { id: 5, type: "code", q: "Implement a SQL query that fetches the top 5 highest paying customers from an Orders table." },
    { id: 6, type: "logic", q: "How do you handle horizontal scaling in a Node environment (e.g., using clustering or PM2)?" },
    { id: 7, type: "code", q: "Write a function using bcrypt to securely hash a plaintext password string with salt rounds=10." },
    { id: 8, type: "logic", q: "Describe the differences between relational (SQL) and non-relational (NoSQL) databases." },
    { id: 9, type: "code", q: "Draft an Express route that accepts file uploads using multer." },
    { id: 10, type: "logic", q: "What is a JWT and how does signature verification protect against forgery?" },
  ]
};

// Fallback logic for Fullstack is a mix. We will just use 'backend' or 'frontend' based on role.

export const TechnicalRound = ({ role, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  
  let qSet = QUESTIONS.frontend;
  if (role.toLowerCase().includes("backend") || role.toLowerCase().includes("data") || role.toLowerCase().includes("python")) {
    qSet = QUESTIONS.backend;
  }
  
  useEffect(() => {
    if (timeLeft <= 0) {
      forceSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e) => {
    setAnswers(prev => ({ ...prev, [qSet[currentIndex].id]: e.target.value }));
  };

  const forceSubmit = () => {
    // Basic mock evaluation logic
    let score = 0;
    qSet.forEach(q => {
      const response = answers[q.id] || "";
      if (response.trim().length > 30) score++; // Award 1 point per question if they wrote at least 30 chars
    });
    // Scale out of 10 score max
    onComplete(score);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const q = qSet[currentIndex];
  const isLast = currentIndex === qSet.length - 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 w-full max-w-4xl mx-auto mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technical Round</h2>
          <p className="text-gray-500 text-sm mt-1">Round 2: {role} DSA & Coding</p>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
          <RiTimeLine size={20} /> <span className="text-xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Challenge {currentIndex + 1} of 10</span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-bold uppercase">{q.type}</span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{width: `${((currentIndex + 1)/10)*100}%`}}
        ></div>
      </div>

      {/* Editor/Question Space */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        
        {/* Left: Prompt */}
        <div className="lg:col-span-2 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiCodeBoxLine className="text-indigo-600" />
            <h3 className="font-bold text-indigo-900">Task Objective</h3>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">
            {q.q}
          </p>
          <div className="mt-8 pt-6 border-t border-indigo-100/50">
             <p className="text-xs text-indigo-400 font-medium">Expected output: Ensure syntax mapping and robust architectural design choices where necessary. Write pseudocode if strictly blocked.</p>
          </div>
        </div>

        {/* Right: Code Area */}
        <div className="lg:col-span-3">
          <textarea
            value={answers[q.id] || ""}
            onChange={handleChange}
            placeholder={q.type === 'code' ? "// Write your solution snippet here..." : "Type your technical reasoning here..."}
            className="w-full h-80 p-6 bg-[#0d1117] text-gray-300 font-mono text-sm leading-relaxed rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600 resize-none border border-gray-800"
            spellCheck={false}
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
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 transition-all"
          >
            Finish Round 2 <RiCheckDoubleFill />
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(qSet.length - 1, prev + 1))}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/30 transition-all"
          >
            Next Challenge <RiArrowRightLine />
          </button>
        )}
      </div>

    </div>
  );
};
