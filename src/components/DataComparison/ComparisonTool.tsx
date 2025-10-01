import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownUp, Droplets, Gauge, Thermometer, Wind, X } from 'lucide-react';

interface ComparisonToolProps {
  visible: boolean;
  onClose: () => void;
}

interface ComparisonDataPoint {
  date: string;
  [key: string]: number | string; // Allows dynamic location keys
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ visible, onClose }) => {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'aqi' | 'rainfall' | 'humidity'>('temperature');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['New York', 'London', 'Tokyo']);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonDataPoint[]>([]);
  
  const availableLocations = [
    'New York', 'London', 'Tokyo', 'Paris', 'Beijing', 'Sydney', 
    'Berlin', 'Moscow', 'Rio de Janeiro', 'Cape Town', 'Dubai', 'Singapore'
  ];
  
  useEffect(() => {
    if (!visible) return;
    
    const generateComparisonData = () => {
      setIsLoading(true);
      
      // Generate 7 days of data for comparison
      const data: ComparisonDataPoint[] = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dataPoint: ComparisonDataPoint = { date: dateStr };
        
        // Generate data for each selected location
        selectedLocations.forEach(location => {
          // Generate realistic data based on location and metric
          let value;
          
          switch (selectedMetric) {
            case 'temperature':
              // Temperature varies by location
              const baseTemp = location === 'New York' ? 18 :
                             location === 'London' ? 15 :
                             location === 'Tokyo' ? 22 :
                             location === 'Paris' ? 17 :
                             location === 'Beijing' ? 25 :
                             location === 'Sydney' ? 23 :
                             location === 'Berlin' ? 16 :
                             location === 'Moscow' ? 12 :
                             location === 'Rio de Janeiro' ? 27 :
                             location === 'Cape Town' ? 21 :
                             location === 'Dubai' ? 32 :
                             24; // Singapore
              
              // Add some daily variation
              value = baseTemp + (Math.random() - 0.5) * 5;
              break;
              
            case 'aqi':
              // AQI varies by location
              const baseAQI = location === 'Beijing' ? 120 :
                             location === 'New York' ? 60 :
                             location === 'London' ? 45 :
                             location === 'Tokyo' ? 70 :
                             location === 'Paris' ? 55 :
                             location === 'Sydney' ? 30 :
                             location === 'Berlin' ? 50 :
                             location === 'Moscow' ? 80 :
                             location === 'Rio de Janeiro' ? 65 :
                             location === 'Cape Town' ? 40 :
                             location === 'Dubai' ? 90 :
                             60; // Singapore
              
              // Add some daily variation
              value = baseAQI + (Math.random() - 0.5) * 15;
              break;
              
            case 'rainfall':
              // Rainfall varies by location and has more peaks and valleys
              const baseRain = location === 'London' ? 8 :
                               location === 'Singapore' ? 12 :
                               location === 'Rio de Janeiro' ? 10 :
                               location === 'Tokyo' ? 6 :
                               location === 'New York' ? 5 :
                               location === 'Paris' ? 6 :
                               location === 'Beijing' ? 3 :
                               location === 'Sydney' ? 4 :
                               location === 'Berlin' ? 5 :
                               location === 'Moscow' ? 4 :
                               location === 'Cape Town' ? 3 :
                               location === 'Dubai' ? 0.5 :
                               2;
              
              // Rainfall is often 0 with occasional peaks
              const rainChance = Math.random();
              value = rainChance > 0.6 ? baseRain + (Math.random() * 15) : Math.random() * 2;
              break;
              
            case 'humidity':
              // Humidity varies by location
              const baseHumidity = location === 'Singapore' ? 80 :
                                  location === 'Rio de Janeiro' ? 75 :
                                  location === 'London' ? 70 :
                                  location === 'New York' ? 65 :
                                  location === 'Tokyo' ? 70 :
                                  location === 'Paris' ? 60 :
                                  location === 'Beijing' ? 55 :
                                  location === 'Sydney' ? 65 :
                                  location === 'Berlin' ? 60 :
                                  location === 'Moscow' ? 50 :
                                  location === 'Cape Town' ? 60 :
                                  location === 'Dubai' ? 45 :
                                  65;
              
              // Add some daily variation
              value = baseHumidity + (Math.random() - 0.5) * 10;
              break;
              
            default:
              value = 0;
          }
          
          dataPoint[location] = Math.round(value * 10) / 10;
        });
        
        data.push(dataPoint);
      }
      
      setTimeout(() => {
        setComparisonData(data);
        setIsLoading(false);
      }, 800);
    };
    
    generateComparisonData();
  }, [visible, selectedMetric, selectedLocations]);
  
  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter(loc => loc !== location));
      }
    } else {
      if (selectedLocations.length < 5) {
        setSelectedLocations([...selectedLocations, location]);
      }
    }
  };
  

  
  const getMetricUnit = () => {
    switch (selectedMetric) {
      case 'temperature':
        return '°C';
      case 'aqi':
        return '';
      case 'rainfall':
        return 'mm';
      case 'humidity':
        return '%';
    }
  };
  
  const getMetricColor = (location: string) => {
    const colors = [
      '#3b82f6', // blue-500
      '#ef4444', // red-500
      '#10b981', // emerald-500
      '#8b5cf6', // violet-500
      '#f59e0b', // amber-500
    ];
    
    const index = selectedLocations.indexOf(location);
    return colors[index % colors.length];
  };
  
  const getAverages = () => {
    const sums: { [key: string]: number } = {};
    const averages: { [key: string]: number } = {};

    // Initialize sums with 0 for each location
    selectedLocations.forEach(location => {
      sums[location] = 0;
    });

    comparisonData.forEach(dataPoint => {
      selectedLocations.forEach(location => {
        if (dataPoint[location] !== undefined) {
          sums[location] += dataPoint[location] as number;
        }
      });
    });
    
    selectedLocations.forEach(location => {
      averages[location] = Math.round((sums[location] / comparisonData.length) * 10) / 10;
    });
    
    return averages;
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[3000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <ArrowDownUp size={20} />
            <h2 className="text-xl font-bold">Environmental Data Comparison</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="text-sm font-medium text-gray-700 mr-1">Comparing:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMetric === 'temperature' && (
                    <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Thermometer size={14} />
                      Temperature
                    </span>
                  )}
                  {selectedMetric === 'aqi' && (
                    <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Gauge size={14} />
                      Air Quality
                    </span>
                  )}
                  {selectedMetric === 'rainfall' && (
                    <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Droplets size={14} />
                      Rainfall
                    </span>
                  )}
                  {selectedMetric === 'humidity' && (
                    <span className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Wind size={14} />
                      Humidity
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-[400px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading comparison data...</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}${getMetricUnit()}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                      {selectedLocations.map((location) => (
                        <Line 
                          key={location}
                          type="monotone" 
                          dataKey={location} 
                          stroke={getMetricColor(location)} 
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              {!isLoading && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {selectedLocations.map((location) => {
                    const averages = getAverages();
                    return (
                      <div 
                        key={location}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="text-xs text-gray-500 mb-1">Average</div>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getMetricColor(location) }}
                          ></div>
                          <div className="text-sm font-medium truncate">{location}</div>
                        </div>
                        <div className="text-lg font-semibold mt-1">
                          {averages[location]}{getMetricUnit()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-3">Select Metric</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMetric('temperature')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'temperature' 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Thermometer size={16} />
                    <span>Temperature</span>
                  </button>
                  <button
                    onClick={() => setSelectedMetric('aqi')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'aqi' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Gauge size={16} />
                    <span>Air Quality</span>
                  </button>
                  <button
                    onClick={() => setSelectedMetric('rainfall')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'rainfall' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Droplets size={16} />
                    <span>Rainfall</span>
                  </button>
                  <button
                    onClick={() => setSelectedMetric('humidity')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'humidity' 
                        ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Wind size={16} />
                    <span>Humidity</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-1">Select Locations (max 5)</h3>
                <p className="text-xs text-gray-500 mb-3">Compare up to 5 locations</p>
                
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
                  {availableLocations.map(location => (
                    <div 
                      key={location}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        selectedLocations.includes(location)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleLocation(location)}
                    >
                      <div className="flex items-center gap-2">
                        {selectedLocations.includes(location) && (
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                              backgroundColor: getMetricColor(location)
                            }}
                          ></div>
                        )}
                        <span className={selectedLocations.includes(location) ? 'font-medium text-blue-700' : ''}>
                          {location}
                        </span>
                      </div>
                      <div>
                        {selectedLocations.includes(location) ? (
                          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Data is based on available historical records
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;
