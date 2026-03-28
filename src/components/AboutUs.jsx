import React from 'react';
import { 
  RiTimerFlashLine, 
  RiBrainLine, 
  RiLineChartLine, 
  RiBriefcase4Line, 
  RiFilePaper2Line, 
  RiChatVoiceLine, 
  RiAwardLine,
  RiUserAddLine, 
  RiRobot2Line, 
  RiLightbulbFlashLine, 
  RiLinksLine, 
  RiCheckDoubleFill,
  RiRocketLine,
  RiEyeLine
} from '@remixicon/react';

const AboutUs = () => {
  const features = [
    { icon: RiTimerFlashLine, title: "Internships in 24–48 Hours", text: "Skip the waiting game and get matched instantly.", highlight: true },
    { icon: RiBrainLine, title: "AI-Based Skill Analysis", text: "We analyze your GitHub, resume, and projects automatically.", highlight: false },
    { icon: RiLineChartLine, title: "Personalized Suggestions", text: "Get actionable advice to improve your profile.", highlight: false },
    { icon: RiBriefcase4Line, title: "Real-world Projects", text: "Gain hands-on experience that actually matters.", highlight: false },
    { icon: RiFilePaper2Line, title: "Resume & ATS Optimization", text: "Build a resume that guarantees you get noticed.", highlight: false },
    { icon: RiChatVoiceLine, title: "Mock Interviews", text: "Practice HR and technical rounds with industry experts.", highlight: false },
    { icon: RiAwardLine, title: "Industry Skills", text: "Learn exactly what top companies are actively hiring for.", highlight: false },
  ];

  const steps = [
    { num: "01", icon: RiUserAddLine, title: "Sign Up & Upload", text: "Create an account and upload your resume or link your GitHub profile." },
    { num: "02", icon: RiRobot2Line, title: "AI Analysis", text: "Our advanced AI instantly analyzes your skills and past projects." },
    { num: "03", icon: RiLightbulbFlashLine, title: "Actionable Insights", text: "The platform suggests targeted improvements and highlights missing skills." },
    { num: "04", icon: RiLinksLine, title: "Smart Matching", text: "Apply directly or get auto-matched with the perfect startup internships." },
    { num: "05", icon: RiCheckDoubleFill, title: "Get the Opportunity", text: "Secure your internship offer within 24 to 48 hours." },
  ];

  return (
    <section id="about" className="container section pt-20 pb-24 overflow-hidden">
      
      {/* Header & Intro */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-wide uppercase">
          About Our Platform
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          From Skills to Internship in <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative inline-block">
            24–48 Hours
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="transparent" />
            </svg>
          </span>
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12">
          Our platform is designed to bridge the gap between learning and real-world experience. We help students build practical, job-ready skills and connect them with real internship opportunities quickly.
        </p>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-transform">
            <RiRocketLine className="w-10 h-10 mb-4 text-blue-200" />
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-blue-100 leading-relaxed text-lg">"To make every student industry-ready and employable"</p>
          </div>
          <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <RiEyeLine className="w-10 h-10 mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-lg">"To become the fastest platform connecting skills with real opportunities"</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900">Key Features</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className={`w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  feature.highlight 
                  ? 'bg-blue-50 border-blue-200 shadow-[0_8px_30px_rgb(59,130,246,0.15)] ring-1 ring-blue-500 sm:scale-105 z-10' 
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.highlight ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 animate-pulse' : 'bg-blue-50 text-blue-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className={`text-lg font-bold mb-2 pr-2 ${feature.highlight ? 'text-blue-900' : 'text-gray-900'}`}>{feature.title}</h4>
                <p className={`text-sm ${feature.highlight ? 'text-blue-800 font-medium' : 'text-gray-600'}`}>{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-900 rounded-[40px] p-8 md:p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">How It Works</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Your streamlined path to landing a role in 5 simple steps.</p>
        </div>

        <div className="relative z-10">
          {/* Connector Line for larger screens */}
          <div className="hidden lg:block md:hidden absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gray-800 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-4 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-6 relative group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-xl group-hover:scale-110">
                    <Icon className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors duration-300" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-900 text-xs font-black rounded-full flex items-center justify-center shadow-md">
                      {step.num}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">{step.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed px-2">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutUs;
