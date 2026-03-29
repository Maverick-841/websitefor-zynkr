import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiUserLine, RiSettings4Line } from '@remixicon/react';
import ProfileProgress from '../components/ProfileProgress';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
            <RiArrowLeftLine /> Back
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-gray-800">
             ZYNKAR <span className="text-blue-600">PROFILE</span>
          </div>
          <div></div>{/* Spacer */}
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 pt-10 flex flex-col items-center">
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 max-w-4xl w-full flex flex-col items-center relative gap-4 text-center">
           <div className="absolute top-6 right-6">
             <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 bg-gray-50 rounded-full hover:bg-blue-50">
               <RiSettings4Line size={24} />
             </button>
           </div>
           
           {/* Reusing the circle inside the profile page as well just to show sync */}
           <div className="mb-4 transform scale-150 origin-top">
             <ProfileProgress />
           </div>

           <h1 className="text-3xl font-extrabold text-gray-900 mt-6">{user.fullName || user.name || "User"}</h1>
           <p className="text-gray-500 font-medium">{(user.roles && user.roles.length > 0) ? user.roles[0] : "Tech Professional"}</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-6 mt-10 text-left">
             
             {/* Info Cards */}
             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><RiUserLine size={18} className="text-blue-600"/> Personal Details</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="text-gray-500">Email</span>
                   <span className="font-semibold text-gray-900">{user.email || "Not set"}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="text-gray-500">Phone</span>
                   <span className="font-semibold text-gray-900">{user.phone || "Not set"}</span>
                 </div>
                 <div className="flex justify-between pb-2">
                   <span className="text-gray-500">College</span>
                   <span className="font-semibold text-gray-900">{user.college || "Not set"}</span>
                 </div>
               </div>
             </div>

             <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
               <h3 className="font-bold text-gray-800 mb-4 text-blue-900">Professional Identity</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-blue-100 pb-2">
                   <span className="text-blue-700/70">Skills</span>
                   <span className="font-semibold text-blue-900">{user.skills ? user.skills.length : 0} Added</span>
                 </div>
                 <div className="flex justify-between border-b border-blue-100 pb-2">
                   <span className="text-blue-700/70">Resume</span>
                   <span className="font-semibold text-blue-900">{user.resume ? "Uploaded" : "Pending"}</span>
                 </div>
                 <div className="mt-4 pt-2">
                   <button 
                     onClick={() => navigate('/?edit=true')}
                     className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition"
                   >
                     Edit Profile
                   </button>
                 </div>
               </div>
             </div>

           </div>
        </div>
      </main>
    </div>
  );
};
