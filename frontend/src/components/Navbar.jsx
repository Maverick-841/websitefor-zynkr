import { navItems } from "../constant/data";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RiVipCrownFill } from '@remixicon/react';
import ProfileProgress from './ProfileProgress';

const Navbar = ({ onLoginClick }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPremium(localStorage.getItem('isPremium') === 'true');
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('userProfile'));
    
    checkLogin();
    window.addEventListener('profileUpdated', checkLogin);
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('profileUpdated', checkLogin);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full transition-all">
      <div className="container mx-auto flex items-center justify-between py-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="font-bold text-2xl uppercase tracking-wider text-gray-800">ZYNKAR</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a key={item.id} href={item.href} className="text-gray-600 hover:text-orange-50 transition-colors">
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {isPremium ? (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold rounded-xl border border-yellow-200 shadow-sm cursor-default">
            Premium User <RiVipCrownFill size={18} className="text-amber-500" />
          </div>
        ) : (
          <button onClick={() => navigate('/premium')} className="hidden sm:block px-6 py-2.5 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            Upgrade
          </button>
        )}
        
        {isLoggedIn ? (
          <ProfileProgress />
        ) : (
          <button onClick={onLoginClick} className="primary-btn !py-2.5 !px-6">Login</button>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
