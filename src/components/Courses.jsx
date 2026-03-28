import React from 'react';
import { coursesSecItems } from "../constant/data";
import { RiTimeLine, RiBarChartGroupedLine } from '@remixicon/react';

const Courses = () => {
  return (
    <section id="courses" className="container section pb-24 border-t border-gray-100 pt-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
        <div className="max-w-2xl">
           <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
            Start Learning
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            Trending <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Master exactly what top companies are actively hiring for right now.
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm mb-2">
          View All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursesSecItems.map((course) => {
          const duration = course.tags[0]?.tag || "Self-Paced";
          const level = course.tags[1]?.tag || "All Levels";
          
          return (
            <div 
              key={course.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img 
                  src={course.img} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {course.instructor}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <RiTimeLine size={14} className="text-blue-500" /> {duration}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <RiBarChartGroupedLine size={14} className="text-blue-500" /> {level}
                  </span>
                </div>
                
                <h4 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                  {course.title}
                </h4>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed flex-1">
                  {course.text}
                </p>
                
                <button className="w-full bg-blue-50 text-blue-700 font-bold py-3.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  Enroll Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Courses;
