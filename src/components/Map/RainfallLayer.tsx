import React, { useState, useEffect } from 'react';
import { useMap, Rectangle, Popup } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import { getRainfallData } from '../../services/rainfallService';
import { CloudRain } from 'lucide-react';

interface RainfallData {
  grid: Array<{
    lat: number;
    lon: number;
    value: number; // precipitation in mm
  }>;
}

interface RainfallLayerProps {
  selectedTime?: Date;
}

const RainfallLayer: React.FC<RainfallLayerProps> = ({ selectedTime }) => {
  const map = useMap();
  const [rainfallData, setRainfallData] = useState<RainfallData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchRainfallData = async () => {
      setLoading(true);
      setVisible(false);
      
      try {
        const data = await getRainfallData();
        setRainfallData(data);
        setLoading(false);
        
        // Fade in animation
        setTimeout(() => setVisible(true), 100);
      } catch (error) {
        console.error('Error fetching rainfall data:', error);
        setLoading(false);
      }
    };
    
    fetchRainfallData();
    
    // Refresh data every 30 minutes
    const interval = setInterval(() => {
      fetchRainfallData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedTime]);

  const getRainfallColor = (value: number) => {
    // Color scale for rainfall (mm)
    if (value === 0) return 'transparent';
    if (value < 1) return 'rgba(200, 250, 255, 0.5)';
    if (value < 2.5) return 'rgba(100, 200, 255, 0.5)';
    if (value < 5) return 'rgba(50, 150, 255, 0.6)';
    if (value < 10) return 'rgba(0, 100, 255, 0.7)';
    if (value < 20) return 'rgba(0, 50, 200, 0.7)';
    if (value < 40) return 'rgba(100, 0, 200, 0.7)';
    return 'rgba(150, 0, 150, 0.7)';
  };

  const getCellBounds = (lat: number, lon: number, gridSize: number = 1) => {
    const halfGrid = gridSize / 2;
    return [
      [lat - halfGrid, lon - halfGrid],
      [lat + halfGrid, lon + halfGrid]
    ] as LatLngBoundsExpression;
  };

  const getRainfallIntensity = (value: number) => {
    if (value === 0) return 'No rain';
    if (value < 1) return 'Very light';
    if (value < 2.5) return 'Light';
    if (value < 5) return 'Moderate';
    if (value < 10) return 'Heavy';
    if (value < 20) return 'Very heavy';
    return 'Extreme';
  };

  if (loading || !rainfallData) return null;

  return (
    <>
      {rainfallData.grid.map((cell, idx) => (
        cell.value > 0 && (
          <Rectangle 
            key={`rainfall-${idx}`}
            bounds={getCellBounds(cell.lat, cell.lon)}
            pathOptions={{
              fillColor: getRainfallColor(cell.value),
              fillOpacity: visible ? 0.8 : 0,
              weight: 0,
              color: 'transparent'
            }}
            className="transition-all duration-500 ease-in-out"
          >
            <Popup className="rainfall-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain size={18} className="text-blue-500" />
                  <h3 className="font-bold">Rainfall Data</h3>
                </div>
                <div className="bg-blue-50 p-2 rounded-md mb-2">
                  <div className="text-lg font-bold text-blue-700">{cell.value.toFixed(1)} mm</div>
                  <div className="text-sm text-blue-600">{getRainfallIntensity(cell.value)} precipitation</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Location: {cell.lat.toFixed(2)}°, {cell.lon.toFixed(2)}°
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </Popup>
          </Rectangle>
        )
      ))}
    </>
  );
};

export default RainfallLayer;
