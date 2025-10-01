import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CloudRain, Flame, Gauge, Layers, MapPin, SunMedium } from 'lucide-react';

interface LayerControlProps {
  selectedLayers: string[];
  onLayerToggle: (layer: string) => void;
  mapType: 'standard' | 'satellite';
  onMapTypeChange: (type: 'standard' | 'satellite') => void;
}

const LayerControl: React.FC<LayerControlProps> = ({ 
  selectedLayers, 
  onLayerToggle,
  mapType,
  onMapTypeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const layers = [
    { id: 'weather', name: 'Weather', icon: <SunMedium size={18} className="text-amber-500" /> },
    { id: 'aqi', name: 'Air Quality', icon: <Gauge size={18} className="text-green-500" /> },
    { id: 'wildfires', name: 'Wildfires', icon: <Flame size={18} className="text-red-500" /> },
    { id: 'rainfall', name: 'Rainfall', icon: <CloudRain size={18} className="text-blue-500" /> },
  ];

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg p-3 w-[260px] border border-gray-100 transition-all duration-300">
      <div 
        className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bg-blue-100 p-1 rounded-full">
          <Layers size={16} className="text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-700 flex-1">Map Layers</h3>
        {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </div>
      
      {isExpanded && (
        <>
          <div className="space-y-2 mb-4">
            {layers.map(layer => (
              <div 
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${
                  selectedLayers.includes(layer.id) 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => onLayerToggle(layer.id)}
              >
                <div className="flex items-center gap-2">
                  {layer.icon}
                  <span className="text-sm font-medium">{layer.name}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedLayers.includes(layer.id)
                    ? 'border-blue-600 bg-blue-600 scale-110'
                    : 'border-gray-300'
                }`}>
                  {selectedLayers.includes(layer.id) && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-1 rounded-full">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-700">Map Type</h3>
            </div>
            
            <div className="flex gap-2 mt-2">
              <button
                className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md transition-colors ${
                  mapType === 'standard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onMapTypeChange('standard')}
              >
                Standard
              </button>
              <button
                className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md transition-colors ${
                  mapType === 'satellite'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onMapTypeChange('satellite')}
              >
                Satellite
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LayerControl;
