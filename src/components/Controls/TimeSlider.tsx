import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, RefreshCw } from 'lucide-react';

interface TimeSliderProps {
  onTimeChange: (time: Date) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ onTimeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState(100); // 100% = present time
  const [isAnimating, setIsAnimating] = useState(false);
  const [is24HourView, setIs24HourView] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    
    // Calculate date based on slider (simplified for demo)
    const now = new Date();
    const pastDate = new Date();
    
    if (is24HourView) {
      // Go back up to 24 hours
      const hoursBack = ((100 - newValue) / 100) * 24;
      pastDate.setHours(now.getHours() - hoursBack);
    } else {
      // Go back up to 7 days
      pastDate.setDate(now.getDate() - ((100 - newValue) / 100) * 7);
    }
    
    onTimeChange(pastDate);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    });
  };
  
  const getTimePreviewAtPoint = (percent: number) => {
    const now = new Date();
    const previewDate = new Date();
    
    if (is24HourView) {
      // Calculate hours back based on percent
      const hoursBack = ((100 - percent) / 100) * 24;
      previewDate.setHours(now.getHours() - hoursBack);
      return previewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Calculate days back based on percent
      previewDate.setDate(now.getDate() - ((100 - percent) / 100) * 7);
      return previewDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Generate time points for the 24-hour view
  const generateTimePoints = () => {
    const points = [];
    const now = new Date();
    
    for (let i = 0; i <= 24; i += 4) {
      const pointTime = new Date();
      pointTime.setHours(now.getHours() - i);
      
      const percent = 100 - (i / 24 * 100);
      
      points.push({
        hour: i,
        time: pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        percent
      });
    }
    
    return points.reverse();
  };
  
  const timePoints = generateTimePoints();
  
  // Animate through time periods
  const startTimeAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setValue(0); // Start from the past
    
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setValue(current);
      
      // Calculate date based on current value
      const now = new Date();
      const animatedDate = new Date();
      
      if (is24HourView) {
        const hoursBack = ((100 - current) / 100) * 24;
        animatedDate.setHours(now.getHours() - hoursBack);
      } else {
        animatedDate.setDate(now.getDate() - ((100 - current) / 100) * 7);
      }
      
      onTimeChange(animatedDate);
      
      if (current >= 100) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
    
    return () => clearInterval(interval);
  };
  
  // Toggle between 24-hour view and 7-day view
  const toggleTimeView = () => {
    setIs24HourView(!is24HourView);
    setValue(100); // Reset to current time
    onTimeChange(new Date()); // Reset to current time
  };
  
  // Select a specific hour point
  const selectHourPoint = (percent: number) => {
    setValue(percent);
    
    // Calculate date based on percent
    const now = new Date();
    const selectedDate = new Date();
    
    if (is24HourView) {
      const hoursBack = ((100 - percent) / 100) * 24;
      selectedDate.setHours(now.getHours() - hoursBack);
    } else {
      selectedDate.setDate(now.getDate() - ((100 - percent) / 100) * 7);
    }
    
    onTimeChange(selectedDate);
  };
  
  // Calculate the current date based on slider position
  const currentDate = new Date();
  if (is24HourView) {
    currentDate.setHours(currentDate.getHours() - ((100 - value) / 100) * 24);
  } else {
    currentDate.setDate(currentDate.getDate() - ((100 - value) / 100) * 7);
  }
  
  return (
    <div 
      className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-96 p-4' : 'w-10 h-10'
      }`}
    >
      {isExpanded ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-600">
              <Clock size={16} />
              <h3 className="text-sm font-medium">Time Explorer</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimeView}
                className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                {is24HourView ? '24h View' : '7-Day View'}
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>{is24HourView ? '24 Hours Ago' : 'Past'}</span>
              <div className="flex-1"></div>
              <span>Now</span>
            </div>
            
            <div className="relative">
              <input 
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={handleChange}
                disabled={isAnimating}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
              
              {/* Time preview tooltip that follows the slider */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 -translate-y-7 bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
                style={{ left: `${value}%` }}
              >
                {getTimePreviewAtPoint(value)}
              </div>
              
              {/* Time points for 24-hour view */}
              {is24HourView && (
                <div className="flex justify-between mt-2">
                  {timePoints.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => selectHourPoint(point.percent)}
                    >
                      <div 
                        className={`w-1.5 h-1.5 rounded-full ${
                          Math.abs(value - point.percent) < 5 
                            ? 'bg-blue-600' 
                            : 'bg-gray-400'
                        }`}
                      ></div>
                      <span 
                        className={`text-[8px] mt-1 ${
                          Math.abs(value - point.percent) < 5 
                            ? 'text-blue-600 font-medium' 
                            : 'text-gray-500'
                        }`}
                      >
                        {point.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 rounded-lg p-2">
              <Calendar size={14} />
              <span className="text-sm font-medium">{formatDate(currentDate)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newValue = Math.max(0, value - 10);
                  setValue(newValue);
                  handleChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
                }}
                disabled={value <= 0 || isAnimating}
                className="p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                onClick={startTimeAnimation}
                disabled={isAnimating}
                className={`p-1 ${isAnimating ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} rounded-full transition-colors`}
              >
                <RefreshCw size={16} className={isAnimating ? 'animate-spin' : ''} />
              </button>
              
              <button
                onClick={() => {
                  const newValue = Math.min(100, value + 10);
                  setValue(newValue);
                  handleChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
                }}
                disabled={value >= 100 || isAnimating}
                className="p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 italic text-center border-t border-gray-100 pt-2">
            {value === 100 
              ? 'Showing current data' 
              : isAnimating 
                ? 'Animating through time periods...' 
                : is24HourView 
                  ? `Showing data from ${Math.round((100 - value) / 100 * 24)} hours ago` 
                  : `Showing data from ${Math.round((100 - value) / 100 * 7)} days ago`}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Clock size={18} />
        </button>
      )}
    </div>
  );
};

export default TimeSlider;
