import React, { useState, useEffect } from 'react';
import { useMap, Circle, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { getWildfireData } from '../../services/wildfireService';
import { Calendar, Flame, MapPin, Ruler } from 'lucide-react';

interface WildfireData {
  id: string;
  location: {
    lat: number;
    lon: number;
  };
  name: string;
  area: number; // in hectares
  started: string;
  confidence: 'low' | 'medium' | 'high';
}

interface WildfireLayerProps {
  selectedTime?: Date;
}

const WildfireLayer: React.FC<WildfireLayerProps> = ({ selectedTime }) => {
  const map = useMap();
  const [wildfireData, setWildfireData] = useState<WildfireData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchWildfireData = async () => {
      setLoading(true);
      setVisible(false);
      
      try {
        const data = await getWildfireData();
        setWildfireData(data);
        setLoading(false);
        
        // Fade in animation
        setTimeout(() => setVisible(true), 100);
      } catch (error) {
        console.error('Error fetching wildfire data:', error);
        setLoading(false);
      }
    };
    
    fetchWildfireData();
    
    // Refresh data every hour
    const interval = setInterval(() => {
      fetchWildfireData();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedTime]);

  const getFireRadius = (area: number) => {
    // Calculate radius based on area (simplified)
    return Math.sqrt(area * 10000 / Math.PI);
  };

  const getFireColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return '#FF3300';
      case 'medium':
        return '#FF6600';
      case 'low':
        return '#FF9900';
      default:
        return '#FFCC00';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  if (loading) return null;

  return (
    <>
      {wildfireData.map((fire) => (
        <Circle 
          key={fire.id}
          center={[fire.location.lat, fire.location.lon] as LatLngExpression}
          radius={getFireRadius(fire.area)}
          pathOptions={{
            fillColor: getFireColor(fire.confidence),
            fillOpacity: visible ? 0.6 : 0,
            color: getFireColor(fire.confidence),
            weight: 1
          }}
          className="animate-pulse transition-all duration-500 ease-in-out"
        >
          <Popup className="wildfire-popup">
            <div className="p-2 min-w-[220px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded-full bg-red-100">
                  <Flame className="text-red-500" size={18} />
                </div>
                <h3 className="font-bold text-lg">{fire.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mb-3">
                <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md">
                  <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: getFireColor(fire.confidence) }}></div>
                  <span className="text-sm font-medium">
                    Active Fire - {getConfidenceLabel(fire.confidence)} Confidence
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex items-start gap-1.5">
                  <Calendar size={14} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Started</div>
                    <div className="text-sm font-medium">{formatDate(fire.started)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <Ruler size={14} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Area</div>
                    <div className="text-sm font-medium">{fire.area.toLocaleString()} ha</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-1.5 mb-2">
                <MapPin size={14} className="text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm font-medium">
                    {fire.location.lat.toFixed(2)}, {fire.location.lon.toFixed(2)}
                  </div>
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

export default WildfireLayer;
