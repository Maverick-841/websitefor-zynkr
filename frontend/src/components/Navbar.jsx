import { navItems } from "../constant/data";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileProgress from './ProfileProgress';

const Navbar = ({ onLoginClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
