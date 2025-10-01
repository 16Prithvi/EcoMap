import React, { useState, useEffect, useRef } from 'react';
import { useMap, Circle, Popup, Marker } from 'react-leaflet';
import { Icon, DivIcon, LatLngExpression } from 'leaflet';
import { getWeatherData } from '../../services/weatherService';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Droplets, Sun, Thermometer, Wind } from 'lucide-react';

interface WeatherData {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

interface WeatherLayerProps {
  selectedTime?: Date;
}

const WeatherLayer: React.FC<WeatherLayerProps> = ({ selectedTime }) => {
  const map = useMap();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const particlesRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Get weather data for major cities
  useEffect(() => {
    const fetchWeatherForCities = async () => {
      setLoading(true);
      setVisible(false);
      
      // Major cities coordinates
      const cities = [
        { name: "New York", lat: 40.7128, lon: -74.0060 },
        { name: "London", lat: 51.5074, lon: -0.1278 },
        { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
        { name: "Sydney", lat: -33.8688, lon: 151.2093 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Beijing", lat: 39.9042, lon: 116.4074 },
        { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
        { name: "Cairo", lat: 30.0444, lon: 31.2357 },
        { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
        { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
        { name: "Singapore", lat: 1.3521, lon: 103.8198 },
        { name: "Toronto", lat: 43.6532, lon: -79.3832 },
        { name: "Berlin", lat: 52.5200, lon: 13.4050 },
        { name: "Moscow", lat: 55.7558, lon: 37.6173 },
        { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
      ];
      
      const weatherPromises = cities.map(city => 
        getWeatherData(city.lat, city.lon, selectedTime)
          .then(data => ({
            location: {
              lat: city.lat,
              lon: city.lon,
              name: city.name
            },
            current: data
          }))
          .catch(err => console.error(`Error fetching weather for ${city.name}:`, err))
      );
      
      const results = await Promise.all(weatherPromises);
      setWeatherData(results.filter(Boolean) as WeatherData[]);
      setLoading(false);
      
      // Fade in animation
      setTimeout(() => setVisible(true), 100);
    };
    
    fetchWeatherForCities();
    
    // Refresh data every 10 minutes
    const interval = setInterval(() => {
      fetchWeatherForCities();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedTime]);

  // Weather particle effects
  useEffect(() => {
    if (!particlesRef.current || !showParticles) return;
    
    // Find dominant weather condition
    let dominantCondition = 'clear';
    let hasRain = false;
    let hasSnow = false;
    let hasFog = false;
    
    weatherData.forEach(city => {
      const code = city.current.condition.code;
      if (code >= 1180 && code < 1200) hasRain = true;
      if (code >= 1200 && code < 1300) hasSnow = true;
      if (code >= 1030 && code < 1040) hasFog = true;
    });
    
    if (hasRain) dominantCondition = 'rain';
    if (hasSnow) dominantCondition = 'snow';
    if (hasFog) dominantCondition = 'fog';
    
    // Only start animation if there's weather to show
    if (dominantCondition !== 'clear') {
      const container = particlesRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Clear existing particles
      container.innerHTML = '';
      
      // Create particles based on weather
      const particleCount = dominantCondition === 'rain' ? 100 : 
                           dominantCondition === 'snow' ? 50 : 
                           dominantCondition === 'fog' ? 30 : 0;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        if (dominantCondition === 'rain') {
          particle.className = 'absolute bg-blue-400 opacity-70';
          particle.style.width = '1px';
          particle.style.height = `${5 + Math.random() * 10}px`;
          particle.style.left = `${Math.random() * containerWidth}px`;
          particle.style.top = `${Math.random() * containerHeight}px`;
          particle.style.animationDuration = `${0.5 + Math.random() * 1}s`;
          particle.style.animationDelay = `${Math.random() * 2}s`;
        } else if (dominantCondition === 'snow') {
          particle.className = 'absolute bg-white rounded-full opacity-80';
          particle.style.width = `${2 + Math.random() * 3}px`;
          particle.style.height = particle.style.width;
          particle.style.left = `${Math.random() * containerWidth}px`;
          particle.style.top = `${Math.random() * containerHeight}px`;
          particle.style.animationDuration = `${3 + Math.random() * 5}s`;
          particle.style.animationDelay = `${Math.random() * 5}s`;
        } else if (dominantCondition === 'fog') {
          particle.className = 'absolute bg-white opacity-20 rounded-full blur-md';
          particle.style.width = `${50 + Math.random() * 100}px`;
          particle.style.height = `${20 + Math.random() * 40}px`;
          particle.style.left = `${Math.random() * containerWidth}px`;
          particle.style.top = `${Math.random() * containerHeight}px`;
          particle.style.animationDuration = `${20 + Math.random() * 30}s`;
          particle.style.animationDelay = `${Math.random() * 10}s`;
        }
        
        container.appendChild(particle);
      }
      
      // Add animation class based on weather type
      if (dominantCondition === 'rain') {
        container.classList.add('rain-animation');
      } else if (dominantCondition === 'snow') {
        container.classList.add('snow-animation');
      } else if (dominantCondition === 'fog') {
        container.classList.add('fog-animation');
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [weatherData, showParticles]);

  const getWeatherIcon = (code: number, size: number = 24) => {
    // Animated weather icons
    if (code < 1003) {
      return (
        <div className="relative">
          <Sun size={size} className="text-yellow-500 animate-pulse" />
          <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full blur-md animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>
      );
    }
    
    if (code < 1030) {
      return (
        <div className="relative">
          <Cloud size={size} className="text-gray-500" />
          <div className="absolute inset-0 bg-gray-300 opacity-20 rounded-full blur-md" style={{ animation: 'float 4s ease-in-out infinite' }}></div>
        </div>
      );
    }
    
    if (code < 1100) {
      return (
        <div className="relative">
          <CloudFog size={size} className="text-gray-400" />
          <div className="absolute inset-0 bg-gray-200 opacity-30 rounded-full blur-md" style={{ animation: 'pulse 5s ease-in-out infinite' }}></div>
        </div>
      );
    }
    
    if (code < 1200) {
      return (
        <div className="relative">
          <CloudRain size={size} className="text-blue-500" />
          <div className="absolute -bottom-1 -right-1 w-2 h-4 bg-blue-400 opacity-70 rounded-full animate-bounce"></div>
        </div>
      );
    }
    
    if (code < 1300) {
      return (
        <div className="relative">
          <CloudLightning size={size} className="text-yellow-400" />
          <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full blur-md animate-pulse" style={{ animationDuration: '0.5s' }}></div>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <CloudSnow size={size} className="text-blue-200" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white opacity-70 rounded-full animate-bounce" style={{ animationDuration: '2s' }}></div>
      </div>
    );
  };

  const getTemperatureColor = (temp: number) => {
    // Color based on temperature
    if (temp < 0) return '#9ca3af'; // gray-400
    if (temp < 10) return '#3b82f6'; // blue-500
    if (temp < 20) return '#10b981'; // emerald-500
    if (temp < 30) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const generateWindArrow = (direction: number = 0, speed: number) => {
    // Generate SVG arrow for wind direction
    const arrowSize = Math.min(15, 8 + speed / 5);
    const color = speed < 10 ? '#60a5fa' : speed < 20 ? '#f59e0b' : '#ef4444';
    
    return `
      <svg width="${arrowSize}" height="${arrowSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${direction}deg)">
        <path d="M12 5L12 19M12 5L6 11M12 5L18 11" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  };

  if (loading) return null;

  return (
    <>
      <div 
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-[400]"
      ></div>
      
      {weatherData.map((city, idx) => (
        <Marker 
          key={idx}
          position={[city.location.lat, city.location.lon] as LatLngExpression}
          icon={new DivIcon({
            html: `
              <div class="weather-icon ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all duration-700 flex flex-col items-center">
                <div class="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg rounded-full p-1.5 border border-gray-200 flex flex-col items-center justify-center relative" style="width: 52px; height: 52px;">
                  <div class="text-md font-bold" style="color: ${getTemperatureColor(city.current.temp_c)}">
                    ${Math.round(city.current.temp_c)}°
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                    ${generateWindArrow(Math.random() * 360, city.current.wind_kph)}
                  </div>
                </div>
              </div>
            `,
            className: '',
            iconSize: [52, 52],
            iconAnchor: [26, 26],
          })}
        >
          <Popup className="weather-popup">
            <div className="p-3 min-w-[260px]">
              <h3 className="font-bold text-lg mb-2">{city.location.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="text-3xl font-bold flex items-center" 
                  style={{ color: getTemperatureColor(city.current.temp_c) }}
                >
                  {Math.round(city.current.temp_c)}°C
                  <span className="text-sm text-gray-500 ml-1">
                    ({Math.round(city.current.temp_c * 9/5 + 32)}°F)
                  </span>
                </div>
                <div className="ml-2 text-3xl">
                  {getWeatherIcon(city.current.condition.code, 32)}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-md mb-3">
                <p className="text-sm text-gray-700">{city.current.condition.text}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md mb-3">
                <div className="flex flex-col items-center text-center">
                  <Wind size={18} className="text-blue-500 mb-1" />
                  <span className="text-xs text-gray-500">Wind</span>
                  <span className="text-sm font-medium">{city.current.wind_kph} km/h</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Droplets size={18} className="text-blue-500 mb-1" />
                  <span className="text-xs text-gray-500">Humidity</span>
                  <span className="text-sm font-medium">{city.current.humidity}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Thermometer size={18} className="text-blue-500 mb-1" />
                  <span className="text-xs text-gray-500">Feels Like</span>
                  <span className="text-sm font-medium">{Math.round(city.current.temp_c - 1)}°C</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Based on local weather station data
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <div>Updated: {new Date().toLocaleTimeString()}</div>
                <div>
                  <a href="#" className="text-blue-500 hover:underline text-xs">View Forecast →</a>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default WeatherLayer;
