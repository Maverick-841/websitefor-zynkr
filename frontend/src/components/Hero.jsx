import React from 'react';
import { heroLogos } from "../constant/data";
import { RiFlashlightLine, RiArrowRightSLine } from '@remixicon/react';

const Hero = ({ onGetStarted }) => {
  return (
    <section id="home" className="relative pt-20 pb-32 flex flex-col items-center text-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-70 pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/80 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10"></div>

      <div className="container z-10 flex flex-col items-center">
        <div className="bg-white px-5 py-2.5 rounded-full flex items-center gap-3 shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow cursor-default">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <RiFlashlightLine size={18} />
          </div>
          <span className="font-semibold text-sm sm:text-base text-gray-800 tracking-wide">
            #1 Career Accelerator <span className="text-gray-400 font-normal ml-2">in Tech</span>
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 max-w-5xl leading-tight text-gray-900 tracking-tight">
          Skip the Wait — Get <br className="hidden lg:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Internships & Jobs</span> in 24-72 Hours
        </h1>
        <p className="text-gray-600 mb-12 max-w-2xl text-lg sm:text-xl leading-relaxed">
          Apply once and get matched with real companies for internships and job opportunities within 24–72 hours using our platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto px-4">
          <button onClick={onGetStarted} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-600/40 transition-all flex justify-center items-center gap-2">
            Get Matched Now <RiArrowRightSLine size={20} />
          </button>
          <a href="#courses" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center">
            View Courses
          </a>
        </div>


      </div>
    </section>
  );
};

export default Hero;
