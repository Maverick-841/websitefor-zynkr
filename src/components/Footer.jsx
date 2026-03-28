import { contactInfo, footerLists, socialIcons } from "../constant/data";

const Footer = () => {
  return (
    <footer id="contact" className="container pt-20 pb-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-200 pb-12 mb-8 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <img src="/images/logo.png" alt="logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl uppercase tracking-wider">ZYNKAR</span>
          </div>
          <div className="flex flex-col gap-4 text-gray-600">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.id} className="flex items-center justify-center md:justify-start gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {footerLists.map((list) => (
          <div key={list.id}>
            <h4 className="font-semibold text-lg mb-6">{list.title}</h4>
            <div className="flex flex-col gap-3">
              {list.links.map((link, index) => (
                <a key={index} href="#" className="text-gray-600 hover:text-orange-50 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
        
        <div>
          <h4 className="font-semibold text-lg mb-6">Social Profiles</h4>
          <div className="flex items-center justify-center md:justify-start gap-4">
            {socialIcons.map((social) => {
              const Icon = social.icon;
              return (
                <a 
                  key={social.id} 
                  href={social.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-lg hover:bg-orange-50 hover:text-white transition-all text-gray-700 shadow-sm border border-gray-100"
                >
                  <Icon className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        ZYNKAR &copy; {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
