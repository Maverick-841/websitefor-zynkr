import React from 'react';
import { benefitItems } from "../constant/data";
import { RiArrowRightLine } from '@remixicon/react';

const Benefits = () => {
  return (
    <section id="benefits" className="container section pt-10 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
        <div className="max-w-2xl">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
            Why ZYNKAR
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            Exclusive <span className="text-blue-600">Benefits</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            We don’t just teach you skills; we launch your career. Experience a fully tailored path to success.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {benefitItems.map((benefit) => (
          <div 
            key={benefit.id} 
            className="group bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Number */}
            <h4 className="absolute -top-6 -right-4 text-[120px] font-black text-gray-50 leading-none select-none z-0 group-hover:text-blue-50 transition-colors duration-300">
              {benefit.id.toString().padStart(2, "0")}
            </h4>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <img src={benefit.icon} alt="icon" className="w-8 h-8 object-contain" />
              </div>
              <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 pr-4">{benefit.title}</h4>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{benefit.text}</p>
            </div>
            
            {/* Small decorative arrow at bottom right */}
            <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10">
              <RiArrowRightLine size={18} className="text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
