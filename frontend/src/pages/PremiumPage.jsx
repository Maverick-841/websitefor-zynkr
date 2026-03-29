import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiCheckLine, RiVipCrownFill, RiArrowLeftLine, RiSecurePaymentLine, RiCloseLine } from '@remixicon/react';

const PLANS = [
  {
    id: "3m",
    title: "3 Months Plan",
    price: "₹100",
    period: "/ 3 months",
    features: [
      "Access all premium courses",
      "Limited mock interviews (2/mo)",
      "Basic resume templates",
      "Community forum access"
    ],
    highlight: false
  },
  {
    id: "6m",
    title: "6 Months Plan",
    price: "₹400",
    period: "/ 6 months",
    features: [
      "Access all premium courses",
      "Mock interviews (5/mo)",
      "AI resume builder access",
      "1-on-1 mentorship (1/mo)",
      "Priority community support"
    ],
    highlight: true,
    badge: "Most Popular"
  },
  {
    id: "1y",
    title: "1 Year Plan",
    price: "₹500",
    period: "/ year",
    features: [
      "Access all premium courses",
      "Unlimited mock interviews",
      "AI resume builder pro",
      "1-on-1 mentorship (4/mo)",
      "Job guarantee program",
      "Dedicated career coach"
    ],
    highlight: false
  }
];

const PaymentModal = ({ plan, onClose, onSuccess }) => {
  const [txnId, setTxnId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = () => {
    if (txnId.trim().length < 3) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(plan);
    }, 2000); // simulate network request for payment
  };

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
          <RiCloseLine size={24} />
        </button>
        
        <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-blue-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manual Payment Sync</h2>
          <p className="text-gray-600">{plan.title} - <span className="font-bold text-gray-900">{plan.price}</span></p>
        </div>

        <div className="p-8 space-y-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-white p-2 border-2 border-gray-200 rounded-2xl mx-auto flex items-center justify-center relative overflow-hidden shadow-sm">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3D9704793532%40ybl%26pn%3DZynkr%26cu%3DINR" alt="Payment QR" className="w-full h-full object-contain" />
          </div>
          <p className="text-sm font-bold text-gray-700 text-center">Scan with PhonePe / GPay to pay {plan.price}</p>
          
          <div className="w-full">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Transaction ID / UTR</label>
            <input 
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none font-mono text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
            />
          </div>

          <button 
            onClick={handleVerify}
            disabled={isProcessing || txnId.length < 3}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
              isProcessing || txnId.length < 3
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-600/30'
            }`}
          >
            {isProcessing ? "Verifying Transaction..." : "Verify Payment"}
          </button>
          <p className="text-xs text-center text-gray-400 font-medium">Auto-mock backend validation system.</p>
        </div>
      </div>
    </div>
  );
};

export const PremiumPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePaymentSuccess = (plan) => {
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumDuration', plan.id);
    setSelectedPlan(null);
    setShowSuccess(true);
    
    // Check if redirect is specified
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect');
    
    setTimeout(() => {
      if (redirectPath === 'tests') {
         navigate('/tests');
      } else {
         navigate('/#courses'); // go back to courses anchor
      }
    }, 2500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 animate-slide-up">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <RiCheckLine size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful! ✅</h2>
          <p className="text-gray-600 mb-8 font-medium">
            You are now a ZYNKAR Premium member. Redirecting you to your courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-indigo-500">
      
      {selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {/* Nav */}
      <nav className="border-b border-gray-800/50 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition-colors">
            <RiArrowLeftLine /> Back
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
             ZYNKAR <span className="text-indigo-500 bg-indigo-500/10 px-2 rounded">PRO</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center relative">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-3xl mb-20 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">career potential</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Accelerate your learning curve with premium courses, authentic mock interviews, and AI-driven resume targeting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10 items-center">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative group w-full rounded-3xl transition-all duration-300 ease-out flex flex-col h-full
                hover:scale-105 hover:z-20 bg-[#0a0f1c]/50 p-[1px]
                ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-blue-500 to-cyan-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] md:-translate-y-4 scale-100 md:scale-105'
                    : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]'
                }
              `}
            >
              {plan.badge && (
                <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-blue-400/50">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="relative h-full flex flex-col bg-[#0a0f1c] backdrop-blur-xl rounded-3xl p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-xl font-medium text-slate-300 group-hover:text-blue-400 transition-colors duration-300">
                    {plan.title}
                  </h3>
                  
                  <div className="mt-4 flex items-end gap-2 pb-6 border-b border-slate-800/80 mb-8">
                    <span className="text-5xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 font-medium mb-1">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <RiCheckLine className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`
                      mt-8 w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center
                      ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                          : 'bg-slate-800 text-slate-200 hover:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                      }
                    `}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
