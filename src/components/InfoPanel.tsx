import React from 'react';
import { CloudRain, Flame, Gauge, Globe, Info, Map, Wind, X } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-fadeIn">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-t-lg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe size={20} className="text-blue-300" />
            About EcoMap
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700">
              EcoMap provides real-time environmental data visualization, allowing you to explore current conditions around the world. The application combines multiple data sources to give you a comprehensive view of our planet's environmental state.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-4 flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            Available Data Layers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg flex items-start gap-3 transform transition-transform hover:scale-[1.02] shadow-sm">
              <div className="mt-1 bg-amber-200 p-2 rounded-full">
                <SunMedium size={18} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-900">Weather</h4>
                <p className="text-sm text-amber-700 mt-1">Current temperature, humidity, wind speed and weather conditions.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg flex items-start gap-3 transform transition-transform hover:scale-[1.02] shadow-sm">
              <div className="mt-1 bg-green-200 p-2 rounded-full">
                <Gauge size={18} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900">Air Quality</h4>
                <p className="text-sm text-green-700 mt-1">Air Quality Index (AQI) with color-coded indicators for pollution levels.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg flex items-start gap-3 transform transition-transform hover:scale-[1.02] shadow-sm">
              <div className="mt-1 bg-red-200 p-2 rounded-full">
                <Flame size={18} className="text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-900">Wildfires</h4>
                <p className="text-sm text-red-700 mt-1">Active wildfire locations with severity and area information.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg flex items-start gap-3 transform transition-transform hover:scale-[1.02] shadow-sm">
              <div className="mt-1 bg-blue-200 p-2 rounded-full">
                <CloudRain size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Rainfall</h4>
                <p className="text-sm text-blue-700 mt-1">Precipitation heatmap showing rainfall patterns across regions.</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-4 flex items-center gap-2">
            <Map size={18} className="text-blue-600" />
            Advanced Features
          </h3>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="flex flex-col">
                <h4 className="font-medium text-gray-900">Time Explorer</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Explore how environmental conditions change over time by using the timeline slider at the bottom of the map.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="flex flex-col">
                <h4 className="font-medium text-gray-900">Location Search</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Quickly navigate to specific locations using the search feature in the top-left corner.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="flex flex-col">
                <h4 className="font-medium text-gray-900">Statistics Dashboard</h4>
                <p className="text-sm text-gray-700 mt-1">
                  View trends and statistics by clicking the chart icon in the control panel.
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-4 flex items-center gap-2">
            <Wind size={18} className="text-blue-600" />
            How to Use
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Toggle data layers using the control panel in the top-right</li>
            <li>Click on map markers to view detailed information</li>
            <li>Switch between standard and satellite map views</li>
            <li>Allow location access to center the map on your position</li>
            <li>Use the time slider to view historical data patterns</li>
            <li>Open the statistics panel to see environmental trends</li>
          </ul>
          
          <p className="text-gray-500 text-sm mt-6">
            Data is simulated for demonstration purposes. In a production environment, this application would connect to real-time environmental data APIs such as weather services, air quality monitoring networks, wildfire tracking systems, and precipitation radar data.
          </p>
        </div>
        
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SunMedium = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

export default InfoPanel;
