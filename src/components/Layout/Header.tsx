import React, { useState, useEffect } from 'react';
import { BarChartBig, Globe, Info, Menu, X } from 'lucide-react';

interface HeaderProps {
  toggleInfo: () => void;
  toggleStats: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleInfo, toggleStats }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={`bg-gradient-to-r from-blue-700 to-blue-900 text-white transition-all duration-300 ${
      scrolled ? 'shadow-xl' : 'shadow-lg'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-full p-1.5">
            <Globe size={20} className="text-blue-100" />
          </div>
          <h1 className="text-xl font-bold">
            Eco<span className="text-blue-300">Map</span>
          </h1>
          <div className="hidden sm:flex text-xs bg-blue-600 px-2 py-0.5 rounded-full ml-2 items-center">
            <span className="animate-pulse mr-1.5 bg-green-400 h-1.5 w-1.5 rounded-full"></span>
            <span>Live Data</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleInfo}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
          >
            <Info size={16} />
            <span>About</span>
          </button>
          
          <button
            onClick={toggleStats}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
          >
            <BarChartBig size={16} />
            <span>Statistics</span>
          </button>
        </div>
        
        <button 
          className="md:hidden flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 animate-slideDown">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
            <button
              onClick={() => {
                toggleInfo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md"
            >
              <Info size={16} />
              <span>About</span>
            </button>
            
            <button
              onClick={() => {
                toggleStats();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md"
            >
              <BarChartBig size={16} />
              <span>Statistics</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
