import React, { useState, useEffect } from 'react';
import { useMap, Circle, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { getAQIData } from '../../services/aqiService';
import { Gauge } from 'lucide-react';

interface AQIData {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
}

interface AQILayerProps {
  selectedTime?: Date;
}

const AQILayer: React.FC<AQILayerProps> = ({ selectedTime }) => {
  const map = useMap();
  const [aqiData, setAqiData] = useState<AQIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchAQIData = async () => {
      setLoading(true);
      
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
        { name: "Delhi", lat: 28.6139, lon: 77.2090 },
        { name: "Moscow", lat: 55.7558, lon: 37.6173 },
        { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
        { name: "Berlin", lat: 52.5200, lon: 13.4050 },
        { name: "Madrid", lat: 40.4168, lon: -3.7038 },
        { name: "Rome", lat: 41.9028, lon: 12.4964 },
      ];
      
      const aqiPromises = cities.map(city => 
        getAQIData(city.lat, city.lon)
          .then(data => ({
            location: {
              lat: city.lat,
              lon: city.lon,
              name: city.name
            },
            ...data
          }))
          .catch(err => console.error(`Error fetching AQI for ${city.name}:`, err))
      );
      
      const results = await Promise.all(aqiPromises);
      setAqiData(results.filter(Boolean) as AQIData[]);
      setLoading(false);
      
      // Fade in animation
      setTimeout(() => setVisible(true), 100);
    };
    
    fetchAQIData();
    
    // Refresh data every 30 minutes
    const interval = setInterval(() => {
      fetchAQIData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedTime]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#99004c'; // Very Unhealthy
    return '#7e0023'; // Hazardous
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  if (loading) return null;

  return (
    <>
      {aqiData.map((city, idx) => (
        <Circle 
          key={idx}
          center={[city.location.lat, city.location.lon] as LatLngExpression}
          radius={30000}
          pathOptions={{
            fillColor: getAQIColor(city.aqi),
            fillOpacity: visible ? 0.6 : 0,
            color: getAQIColor(city.aqi),
            weight: 1
          }}
          className="transition-all duration-700 ease-in-out"
        >
          <Popup className="aqi-popup">
            <div className="p-2 min-w-[220px]">
              <h3 className="font-bold text-lg mb-1">{city.location.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="text-white px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1.5"
                  style={{ backgroundColor: getAQIColor(city.aqi) }}
                >
                  <Gauge size={14} />
                  <span>AQI: {city.aqi}</span>
                </div>
                <div className="text-sm">{getAQILabel(city.aqi)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">PM2.5:</span>
                  <span className="ml-1 font-medium">{city.pollutants.pm25} μg/m³</span>
                </div>
                <div>
                  <span className="text-gray-500">PM10:</span>
                  <span className="ml-1 font-medium">{city.pollutants.pm10} μg/m³</span>
                </div>
                <div>
                  <span className="text-gray-500">O₃:</span>
                  <span className="ml-1 font-medium">{city.pollutants.o3} μg/m³</span>
                </div>
                <div>
                  <span className="text-gray-500">NO₂:</span>
                  <span className="ml-1 font-medium">{city.pollutants.no2} μg/m³</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
};

export default AQILayer;
