import React, { useState } from 'react';

interface LegendItem {
  color: string;
  label: string;
}

interface DataLegendProps {
  title: string;
  items: LegendItem[];
  visible: boolean;
}

const DataLegend: React.FC<DataLegendProps> = ({ title, items, visible }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  if (!visible) return null;
  
  return (
    <div 
      className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-[120px] max-w-[200px] transition-all duration-300 ${
        isHovering ? 'bg-opacity-95 shadow-xl' : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="flex items-center justify-between cursor-pointer mb-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xs font-semibold text-gray-700">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-1.5 transition-all duration-300 ease-in-out">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 p-0.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-3 h-3 rounded-sm transition-transform duration-300" 
                style={{ 
                  backgroundColor: item.color,
                  transform: isHovering ? 'scale(1.1)' : 'scale(1)'
                }}
              ></div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataLegend;
