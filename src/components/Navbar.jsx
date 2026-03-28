import { navItems } from "../constant/data";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="container flex items-center justify-between py-6">
      <div className="flex items-center gap-2">
        <img src="/images/logo.png" alt="ZYNKAR Logo" className="w-10 h-10 object-contain" />
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
        <button className="hidden sm:block px-6 py-2.5 rounded hover:bg-gray-100 transition-colors">Sign Up</button>
        <button onClick={onLoginClick} className="primary-btn !py-2.5 !px-6">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
