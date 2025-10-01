import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { Activity, BarChartBig, Droplets, Gauge, RefreshCw, Thermometer, TrendingUp, Wind } from 'lucide-react';

interface StatisticsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ visible, onClose }) => {
  // Mock data for charts
  const aqiTrend = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 49 },
    { name: 'Thu', value: 63 },
    { name: 'Fri', value: 58 },
    { name: 'Sat', value: 51 },
    { name: 'Sun', value: 47 },
  ];
  
  const temperatureTrend = [
    { name: '12AM', value: 23, time: '12:00' },
    { name: '4AM', value: 21, time: '04:00' },
    { name: '8AM', value: 22, time: '08:00' },
    { name: '12PM', value: 28, time: '12:00' },
    { name: '4PM', value: 30, time: '16:00' },
    { name: '8PM', value: 25, time: '20:00' },
    { name: '11PM', value: 24, time: '23:00' },
  ];
  
  const rainfallData = [
    { name: 'Mon', value: 5 },
    { name: 'Tue', value: 10 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 35 },
    { name: 'Fri', value: 15 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 0 },
  ];
  
  const aqiDistribution = [
    { name: 'Good', value: 35, color: '#00e400' },
    { name: 'Moderate', value: 40, color: '#ffff00' },
    { name: 'Unhealthy SG', value: 10, color: '#ff7e00' },
    { name: 'Unhealthy', value: 5, color: '#ff0000' },
    { name: 'Very Unhealthy', value: 2, color: '#99004c' },
    { name: 'Hazardous', value: 1, color: '#7e0023' },
  ];
  
  const [selectedChart, setSelectedChart] = useState<'aqi' | 'temperature' | 'rainfall' | 'forecast'>('aqi');
  const [animateChart, setAnimateChart] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Trigger animation when changing chart
  useEffect(() => {
    setAnimateChart(true);
    const timer = setTimeout(() => setAnimateChart(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedChart]);
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const renderChart = () => {
    switch(selectedChart) {
      case 'aqi':
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateChart ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-blue-600" />
                  <h3 className="font-medium text-blue-800">AQI Trend (7 Days)</h3>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 rounded-full text-blue-700">
                  Avg: 52.1
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={aqiTrend}>
                  <defs>
                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 'dataMax + 20']} hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`AQI: ${value}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="url(#aqiGradient)" 
                    strokeWidth={3}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2">
                <div className="grid grid-cols-6 w-full gap-1">
                  {aqiDistribution.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-full h-1.5 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-[9px] text-gray-500 mt-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-indigo-600" />
                <h3 className="font-medium text-indigo-800">AQI Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={aqiDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={0}
                  >
                    {aqiDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-1 text-center mt-2">
                {aqiDistribution.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-xs">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'temperature':
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateChart ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Thermometer size={16} className="text-orange-600" />
                  <h3 className="font-medium text-orange-800">24-Hour Temperature</h3>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-orange-100 rounded-full text-orange-700">
                  Peak: 30°C
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={temperatureTrend}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 'dataMax + 5']} hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`${value}°C`, '']}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return item ? `${item.time}` : label;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F97316" 
                    fill="url(#tempGradient)" 
                    strokeWidth={3}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <div className="w-12 h-2 bg-gradient-to-r from-blue-400 via-green-300 to-orange-500 rounded-full"></div>
                  <div className="ml-2 text-xs text-gray-500">Temperature scale</div>
                </div>
                <div className="text-xs text-orange-600">
                  <span className="font-medium">Average: 24.7°C</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wind size={16} className="text-teal-600" />
                <h3 className="font-medium text-teal-800">Weather Conditions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-500 mb-1">Humidity</div>
                  <div className="flex items-end">
                    <Droplets size={14} className="text-blue-500 mr-1.5" />
                    <span className="text-lg font-semibold text-blue-700">68%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-3">
                  <div className="text-xs text-teal-500 mb-1">Wind Speed</div>
                  <div className="flex items-end">
                    <Wind size={14} className="text-teal-500 mr-1.5" />
                    <span className="text-lg font-semibold text-teal-700">12 km/h</span>
                  </div>
                  <div className="w-full bg-teal-100 rounded-full h-1.5 mt-2">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'rainfall':
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateChart ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-blue-600" />
                  <h3 className="font-medium text-blue-800">Rainfall (Last 7 Days)</h3>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 rounded-full text-blue-700">
                  Total: 87mm
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={rainfallData}>
                  <defs>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 'dataMax + 10']} hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`${value}mm`, '']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#rainGradient)" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                    animationBegin={0}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-2">
                <div className="text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                  Precipitation amount
                </div>
                <div className="text-xs text-blue-600">
                  Average: 12.4mm/day
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-indigo-600" />
                <h3 className="font-medium text-indigo-800">Rainfall Intensity</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Light Rain (&lt;5mm)</span>
                    <span className="text-gray-700">3 days</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-300 h-2 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Moderate (5-20mm)</span>
                    <span className="text-gray-700">2 days</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Heavy (&gt;20mm)</span>
                    <span className="text-gray-700">1 day</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-700 h-2 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">No Rain</span>
                    <span className="text-gray-700">1 day</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'forecast':
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateChart ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-600" />
                  <h3 className="font-medium text-indigo-800">5-Day Forecast</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[
                  { day: 'Wed', temp: 27, icon: '☀️', condition: 'Sunny' },
                  { day: 'Thu', temp: 25, icon: '⛅', condition: 'Partly Cloudy' },
                  { day: 'Fri', temp: 23, icon: '🌧️', condition: 'Rain' },
                  { day: 'Sat', temp: 24, icon: '🌧️', condition: 'Light Rain' },
                  { day: 'Sun', temp: 26, icon: '☀️', condition: 'Sunny' },
                ].map((day, index) => (
                  <div key={index} className="flex flex-col items-center bg-white bg-opacity-60 rounded-lg p-2">
                    <div className="text-xs font-medium text-indigo-600">{day.day}</div>
                    <div className="text-xl my-1">{day.icon}</div>
                    <div className="text-sm font-semibold">{day.temp}°C</div>
                    <div className="text-[9px] text-gray-500 text-center">{day.condition}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center mt-4">
                <div className="text-xs text-gray-500 italic">
                  Forecasted data is subject to change
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gauge size={16} className="text-purple-600" />
                <h3 className="font-medium text-purple-800">AQI Forecast</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={[
                  { day: 'Wed', aqi: 45 },
                  { day: 'Thu', aqi: 52 },
                  { day: 'Fri', aqi: 58 },
                  { day: 'Sat', aqi: 49 },
                  { day: 'Sun', aqi: 43 },
                ]}>
                  <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`AQI: ${value}`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-purple-50 rounded-lg p-2 flex flex-col items-center">
                  <div className="text-xs text-purple-500">Average</div>
                  <div className="text-lg font-semibold text-purple-700">49.4</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 flex flex-col items-center">
                  <div className="text-xs text-yellow-500">Peak Day</div>
                  <div className="text-lg font-semibold text-yellow-700">Friday</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 flex flex-col items-center">
                  <div className="text-xs text-green-500">Trend</div>
                  <div className="text-lg font-semibold text-green-700">Improving</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`fixed right-0 top-0 bottom-0 bg-white bg-opacity-95 backdrop-blur-md shadow-2xl w-96 transform transition-transform duration-300 ease-in-out z-[2000] ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 text-blue-700">
          <BarChartBig size={20} />
          <h2 className="text-lg font-bold">Environmental Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefreshData}
            className={`text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-5 overflow-y-auto" style={{ height: 'calc(100% - 69px)' }}>
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setSelectedChart('aqi')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedChart === 'aqi' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Air Quality
          </button>
          <button
            onClick={() => setSelectedChart('temperature')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedChart === 'temperature' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setSelectedChart('rainfall')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedChart === 'rainfall' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Rainfall
          </button>
          <button
            onClick={() => setSelectedChart('forecast')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedChart === 'forecast' 
                ? 'bg-indigo-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Forecast
          </button>
        </div>
        
        {renderChart()}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Environmental Alerts</h3>
          <div className="space-y-2">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
              <div className="text-sm font-medium text-amber-700">Moderate AQI Expected</div>
              <div className="text-xs text-amber-600 mt-1">Air quality may decline in the next 24 hours</div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
              <div className="text-sm font-medium text-blue-700">Light Rain Expected</div>
              <div className="text-xs text-blue-600 mt-1">40% chance of precipitation tomorrow</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gray-50 py-2 px-5 text-xs text-center text-gray-500 border-t border-gray-100">
        Data refreshed {new Date().toLocaleTimeString()} • Based on available sensor data
      </div>
    </div>
  );
};

export default StatisticsPanel;
