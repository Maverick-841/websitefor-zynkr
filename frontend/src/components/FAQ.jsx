import { faqItems } from "../constant/data";
import { useState } from "react";

const FAQ = () => {
  const [openId, setOpenId] = useState(1);

  return (
    <section className="container section bg-white rounded-2xl p-8 md:p-16 my-20 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12">
      <div className="lg:w-1/3">
        <h2 className="mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 mb-8">
          Still you have any questions? Contact our Team via teamzinkar@gmail.com
        </p>
        <button className="secondary-btn">See All FAQ's</button>
      </div>
      
      <div className="lg:w-2/3 flex flex-col gap-6">
        {faqItems.map((faq) => (
          <div 
            key={faq.id} 
            className="border border-gray-200 rounded-xl p-6 md:p-8 cursor-pointer transition-all"
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
          >
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-lg md:text-xl font-medium">{faq.title}</h4>
              <div className="w-10 h-10 bg-orange-90 text-orange-50 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                {openId === faq.id ? "X" : "+"}
              </div>
            </div>
            
            {openId === faq.id && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-gray-600">
                {faq.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
