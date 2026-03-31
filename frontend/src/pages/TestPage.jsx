import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiTimerLine, RiArrowLeftLine, RiRefreshLine, RiArrowRightLine, RiTrophyFill, RiPlayCircleLine, RiCheckDoubleLine, RiDownloadCloud2Line, RiCloseCircleLine } from '@remixicon/react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { questions as aptitudeQuestions } from '../constant/questions';
import { dsaQuestions } from '../constant/dsaQuestions';
import { finalQuestions } from '../constant/finalQuestions';

export const TestPage = () => {
  const navigate = useNavigate();
  const { roundId } = useParams();

  const getMappedRound = (id) => {
    if (id === 'round1') return 1;
    if (id === 'round2') return 2;
    if (id === 'round3') return 3;
    return 1;
  };

  const [currentRound, setCurrentRound] = useState(getMappedRound(roundId));
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");

  useEffect(() => {
    setCurrentRound(getMappedRound(roundId));
  }, [roundId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSubmitted(false);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTerminalOutput("");

    let source = [];
    let count = 10;

    if (currentRound === 1) {
      source = [...aptitudeQuestions];
      count = 10;
      setTimeLeft(600); // 10 mins
    } else if (currentRound === 2) {
      source = [...dsaQuestions];
      count = 5;
      setTimeLeft(420); // 7 mins
    } else {
      source = [...finalQuestions];
      count = 5;
      setTimeLeft(300); // 5 mins
    }

    const shuffled = source.sort(() => 0.5 - Math.random());
    const sliced = shuffled.slice(0, count);
    setTestQuestions(sliced);

    if (currentRound === 2 && sliced.length > 0) {
      setUserCode(sliced[0].template || "");
    }
  }, [currentRound]);

  // Load template on question change for round 2
  useEffect(() => {
    if (currentRound === 2 && testQuestions[currentIdx]) {
      // Only set template if they haven't solved it already?
      // Actually, just set the template to start fresh for simplicity, or if they haven't typed anything
      setUserCode(testQuestions[currentIdx].template || "");
      setTerminalOutput("");
    }
  }, [currentIdx, currentRound, testQuestions]);

  // Timer logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) {
        // Auto submit forcefully
        handleSubmit();
        alert("Time's up! Auto submitted.");
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSelectMCQ = (option) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: option }));
  };

  const handleRunCode = () => {
    const q = testQuestions[currentIdx];
    try {
      const exec = `${userCode}\n\nreturn ${q.testCases[0].call};`;
      const func = new Function(exec);
      const res = func();
      const stringifiedRes = JSON.stringify(res) || String(res);

      if (stringifiedRes === String(q.testCases[0].expected).replace(/'/g, '"')) {
        setTerminalOutput(`Output: ${stringifiedRes}\nStatus: Accepted ✅`);
      } else {
        setTerminalOutput(`Output: ${stringifiedRes}\nExpected: ${q.testCases[0].expected}\nStatus: Wrong ❌`);
      }
    } catch (e) {
      setTerminalOutput(`Runtime Error: ${e.message}`);
    }
  };

  const handleSubmitCode = () => {
    const q = testQuestions[currentIdx];
    let allPassed = true;
    let logs = [];

    try {
      for (let i = 0; i < q.testCases.length; i++) {
        const tc = q.testCases[i];
        const exec = `${userCode}\n\nreturn ${tc.call};`;
        const func = new Function(exec);
        const res = func();
        const stringifiedRes = JSON.stringify(res) || String(res);
        const expectedStr = String(tc.expected).replace(/'/g, '"'); // normalize

        if (stringifiedRes !== expectedStr) {
          allPassed = false;
          logs.push(`Test Case ${i + 1} Failed ❌\nOutput: ${stringifiedRes}\nExpected: ${tc.expected}`);
          break;
        } else {
          logs.push(`Test Case ${i + 1} Passed ✅`);
        }
      }
    } catch (e) {
      allPassed = false;
      logs.push(`Runtime Error: ${e.message}`);
    }

    setTerminalOutput(logs.join('\n\n'));

    // Save state
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: allPassed }));
  };

  const handleNext = () => {
    if (currentIdx < testQuestions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleSubmit = () => {
    let correct = 0;
    if (currentRound === 2) {
      testQuestions.forEach((_, idx) => {
        if (selectedAnswers[idx] === true) correct++;
      });
    } else {
      testQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer) correct++;
      });
    }
    setScore(correct);
    setIsSubmitted(true);

    // Save to global leaderboard
    try {
      let lb = JSON.parse(localStorage.getItem('globalLeaderboard')) || [];
      const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { fullName: 'Guest User' };
      const maxTime = currentRound === 1 ? 600 : currentRound === 2 ? 420 : 300;
      lb.push({
        userName: userProfile.fullName || "Guest User",
        score: correct,
        round: currentRound,
        timeTaken: maxTime - timeLeft,
        date: new Date().toISOString()
      });
      localStorage.setItem('globalLeaderboard', JSON.stringify(lb));
    } catch (e) { }

    // Confetti Check
    if (currentRound === 3 && correct >= 3) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }

    window.scrollTo(0, 0);
  };

  const getRoundConfig = () => {
    if (currentRound === 1) return { title: "Aptitude Test", cutoff: 6 };
    if (currentRound === 2) return { title: "DSA Test (Easy)", cutoff: 3 };
    return { title: "Final Round (Mixed)", cutoff: 3 };
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (testQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-semibold">Loading questions...</p>
        </div>
      </div>
    );
  }

  const config = getRoundConfig();
  const currentQ = testQuestions[currentIdx];
  const isLast = currentIdx === testQuestions.length - 1;
  const isAllAnswered = Object.keys(selectedAnswers).length === testQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load this question</h2>
          <p className="text-gray-600 mb-4">Please restart this round.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Reload Test
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const isPass = score >= config.cutoff;

    let resText = !isPass ? "Needs Improvement" : (score / testQuestions.length >= 0.8 ? "Excellent 🔥" : "Good ✅");
    let resColor = !isPass ? "text-red-600" : (score / testQuestions.length >= 0.8 ? "text-green-600" : "text-blue-600");
    let resBg = !isPass ? "bg-red-50" : (score / testQuestions.length >= 0.8 ? "bg-green-50" : "bg-blue-50");
    let resBorder = !isPass ? "border-red-200" : (score / testQuestions.length >= 0.8 ? "border-green-200" : "border-blue-200");

    const handleDownloadCertificate = () => {
      const doc = new jsPDF('landscape');
      const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { fullName: 'Candidate' };
      const date = new Date().toLocaleDateString();
      const certId = "ZY-" + Math.random().toString(36).substring(2, 10).toUpperCase();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text("ZYNKAR", 148, 50, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(24);
      doc.setTextColor(31, 41, 55);
      doc.text("Certificate of Completion", 148, 70, { align: "center" });

      doc.setFontSize(16);
      doc.text("This certifies that", 148, 90, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.text(userProfile.fullName || "Tech Professional", 148, 110, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("has successfully cleared all 3 rounds of the ZYNKAR Skill Assessment", 148, 130, { align: "center" });
      doc.text("demonstrating extreme proficiency in Aptitude and Algorithms.", 148, 140, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Date of Issue: ${date}`, 70, 170, { align: "center" });
      doc.text(`Final Round Score: ${score}/5`, 220, 170, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Credential ID: ${certId}`, 148, 190, { align: "center" });

      doc.setLineWidth(2);
      doc.setDrawColor(79, 70, 229);
      doc.rect(10, 10, 277, 190);

      doc.save(`ZYNKAR_Certificate_${userProfile.fullName || 'Candidate'}.pdf`);
    };

    const handleAction = () => {
      if (isPass) {
        if (currentRound === 1) localStorage.setItem('round1Passed', 'true');
        if (currentRound === 2) localStorage.setItem('round2Passed', 'true');
        if (currentRound === 3) localStorage.setItem('round3Passed', 'true');

        setIsTransitioning(true);
        setTimeout(() => {
          navigate('/tests'); // Always return to dashboard after passing
        }, 1500);
      } else {
        window.location.reload();
      }
    };

    if (isTransitioning) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Routing to Dashboard...</h2>
          <p className="text-gray-500 font-medium">Validating your testing data.</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">

        <div className={`max-w-md w-full rounded-3xl p-10 text-center shadow-lg border ${resBorder} ${resBg} relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${isPass ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-red-500'}`}></div>

          {currentRound === 3 && isPass ? (
            <div className="flex justify-center mb-6 text-yellow-500">
              <RiTrophyFill size={64} className="drop-shadow-md animate-bounce" />
            </div>
          ) : null}

          {currentRound === 3 && isPass ? (
            <h2 className="text-3xl font-black mb-2 text-gray-900">🎉 You cleared all rounds!</h2>
          ) : (
            <h2 className={`text-4xl font-black mb-2 ${resColor}`}>{resText}</h2>
          )}

          <p className="text-gray-600 font-medium mb-2">Score: {score}/{testQuestions.length}</p>
          <p className="text-sm text-gray-500 mb-8">
            Correct Answers: {score} | Wrong Answers: {testQuestions.length - score} | Accuracy: {Math.round((score / testQuestions.length) * 100)}%
          </p>

          <div className="w-32 h-32 mx-auto rounded-full bg-white shadow-inner flex items-center justify-center mb-6 border-4 border-white">
            <span className="text-5xl font-black text-gray-900">{score}<span className="text-gray-400 text-2xl">/{testQuestions.length}</span></span>
          </div>

          <div className="flex flex-col gap-3">
            {currentRound === 3 && isPass && (
              <button
                onClick={handleDownloadCertificate}
                className="w-full py-4 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 animate-pulse"
              >
                <RiDownloadCloud2Line /> Download Certificate PDF
              </button>
            )}

            {!isPass && (
              <button
                onClick={handleAction}
                className="w-full py-4 text-white font-bold rounded-xl shadow-md hover:-translate-y-1 transition-all flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800"
              >
                <RiRefreshLine /> Retry Test
              </button>
            )}

            {isPass && (
              <button
                onClick={handleAction}
                className="w-full py-4 text-white font-bold rounded-xl shadow-md hover:-translate-y-1 transition-all flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Return to Dashboard <RiArrowRightLine />
              </button>
            )}

            {!isPass && currentRound < 3 && (
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    navigate('/tests');
                  }, 1000);
                }}
                className="w-full py-3 text-red-600 font-bold border border-red-200 bg-white rounded-xl hover:bg-red-50 transition-colors mt-2"
              >
                Force Pass (Testing)
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mt-2"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Common Header
  const Navbar = () => (
    <nav className="bg-[#111827] border-b border-gray-800 sticky top-0 z-30 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-white">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition-colors">
          <RiArrowLeftLine /> Exit
        </button>
        <div className="flex items-center gap-2 font-bold tracking-wider hidden sm:flex">
          ZYNKAR <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full text-sm">ROUND {currentRound}/3</span>
        </div>
        <div className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg ${timeLeft <= 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
          <RiTimerLine size={18} /> {formatTime(timeLeft)}
        </div>
      </div>
    </nav>
  );

  if (currentRound === 2) {
    const isCorrect = selectedAnswers[currentIdx] === true;
    const isAnswered = selectedAnswers[currentIdx] !== undefined;

    return (
      <div className="min-h-screen bg-[#0a0f1c] flex flex-col font-mono text-gray-300">
        <Navbar />

        <main className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-76px)] overflow-hidden">

          {/* Left Side: Problem Description */}
          <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-800 h-full overflow-y-auto bg-[#111827] p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Question {currentIdx + 1} of 5</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">{currentQ.difficulty}</span>
            </div>

            <h1 className="text-3xl font-black text-white mb-6">{currentQ.title}</h1>

            <p className="text-gray-400 leading-relaxed mb-8">{currentQ.description}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Example Input</h3>
                <div className="bg-[#1f2937] p-4 rounded-xl text-green-400 text-sm font-mono border border-gray-700">
                  {currentQ.exampleInput}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Expected Output</h3>
                <div className="bg-[#1f2937] p-4 rounded-xl text-blue-400 text-sm font-mono border border-gray-700">
                  {currentQ.exampleOutput}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Constraints</h3>
                <div className="bg-[#1f2937] p-4 rounded-xl text-yellow-400 text-sm font-mono border border-gray-700 whitespace-pre-line">
                  {currentQ.constraints}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: IDE & Terminal */}
          <div className="w-full lg:w-1/2 flex flex-col h-full bg-[#0a0f1c]">
            {/* IDE Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#111827]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <select className="bg-[#1f2937] text-white text-sm font-bold px-3 py-1 rounded-lg border border-gray-700 outline-none">
                <option>JavaScript</option>
              </select>
            </div>

            {/* Textarea Code Editor */}
            <div className="flex-1 w-full bg-[#0a0f1c] relative">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck="false"
                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm leading-7 p-6 outline-none resize-none border-none placeholder-gray-700"
              ></textarea>
            </div>

            {/* Terminal Output */}
            <div className="h-48 border-t border-gray-800 bg-[#111827] flex flex-col">
              <div className="px-4 py-2 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between items-center">
                <span>Terminal</span>
                {isAnswered && (
                  <span className={isCorrect ? "text-green-500 flex items-center gap-1" : "text-red-500 flex items-center gap-1"}>
                    {isCorrect ? <RiCheckDoubleLine size={14} /> : <RiCloseCircleLine size={14} />}
                    {isCorrect ? "ACCEPTED" : "FAILED"}
                  </span>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto text-sm font-mono whitespace-pre-line text-gray-400">
                {terminalOutput || "> Run or Submit your code to see results..."}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-800 bg-[#0a0f1c] flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1f2937] hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  <RiPlayCircleLine size={18} /> Run
                </button>
                <button
                  onClick={handleSubmitCode}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600/20 text-green-500 hover:bg-green-600/30 font-bold rounded-lg transition-colors border border-green-600/30"
                >
                  <RiCheckDoubleLine size={18} /> Submit
                </button>
              </div>

              <div className="flex gap-2">
                {currentIdx > 0 && (
                  <button onClick={handlePrev} className="px-4 py-2 text-gray-400 hover:text-white font-bold">Prev</button>
                )}
                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Finish Round
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Round 1 / Round 3 UI -> MCQ
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/tests')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
            <RiArrowLeftLine /> Exit Test
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-gray-800 hidden sm:flex">
            ZYNKAR <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">ROUND {currentRound}/3</span>
          </div>
          <div className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg ${timeLeft <= 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
            <RiTimerLine size={18} /> {formatTime(timeLeft)}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-10 flex flex-col items-center">

        <div className="w-full max-w-3xl mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{config.title}</h1>
          <p className="text-gray-500 font-medium">{testQuestions.length} Questions • Pass marks: {config.cutoff}</p>
          <p className="text-sm text-blue-700 font-semibold mt-1">Answered: {answeredCount}/{testQuestions.length}</p>
        </div>

        {/* Progress Stepper */}
        <div className="w-full max-w-3xl flex items-center justify-between mb-8 px-2">
          {testQuestions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2 flex-1 mx-1 rounded-full cursor-pointer transition-colors ${i === currentIdx ? 'bg-blue-600 scale-y-150 relative z-10' :
                  selectedAnswers[i] ? 'bg-green-500' : 'bg-gray-200'
                }`}
            ></div>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 max-w-3xl w-full flex flex-col relative min-h-[400px]">
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-4 block">Question {currentIdx + 1} of {testQuestions.length}</span>

          <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-4 flex-1">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentIdx] === opt;
              return (
                <div
                  key={i}
                  onClick={() => handleSelectMCQ(opt)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                    {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                  </div>
                  <span className={`font-semibold text-lg ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{opt}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-6 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
            >
              Previous
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!isAllAnswered}
                className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all ${isAllAnswered
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden sm:block'
                  }`}
              >
                {isAllAnswered ? "Submit Test" : "Answer All to Submit"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg md:hover:-translate-y-1 transition-all"
              >
                Next Question
              </button>
            )}

            {isLast && !isAllAnswered && (
              <button
                disabled
                className="px-8 py-3 bg-gray-200 text-gray-400 font-bold rounded-xl sm:hidden"
              >
                Pending
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};
