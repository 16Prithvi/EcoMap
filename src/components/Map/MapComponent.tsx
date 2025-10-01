import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, Map as LeafletMap } from 'leaflet';
import { useGeolocation } from '../../hooks/useGeolocation';
import WeatherLayer from './WeatherLayer';
import AQILayer from './AQILayer';
import WildfireLayer from './WildfireLayer';
import RainfallLayer from './RainfallLayer';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  selectedLayers: string[];
  mapType: 'standard' | 'satellite';
  selectedTime?: Date;
  searchQuery?: string;
}

// Component to handle map recenter when location changes
function ChangeMapView({ center, searchQuery }: { center: [number, number] | null, searchQuery?: string }) {
  const map = useMap();
  const hasSearched = useRef(false);
  
  useEffect(() => {
    if (center && !hasSearched.current) {
      map.setView(center, 10);
    }
  }, [center, map]);
  
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      // Simulate geocoding search
      // In a real app, this would call a geocoding service
      
      // For demo, just move to random locations based on search query hash
      const hash = searchQuery.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const lat = (hash % 150) - 75; // -75 to 75
      const lng = (hash % 340) - 170; // -170 to 170
      
      map.setView([lat, lng], 11);
      hasSearched.current = true;
      
      // Reset after 5 seconds
      setTimeout(() => {
        hasSearched.current = false;
      }, 5000);
    }
  }, [searchQuery, map]);
  
  return null;
}

// Add map loading overlay
function MapLoading() {
  const [loading, setLoading] = useState(true);
  const map = useMap();
  
  useEffect(() => {
    const onLoad = () => {
      setLoading(false);
    };
    
    map.once('load', onLoad);
    // Fallback in case the event doesn't fire
    setTimeout(() => setLoading(false), 2000);
    
    return () => {
      map.off('load', onLoad);
    };
  }, [map]);
  
  if (!loading) return null;
  
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 z-[1000] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-700 font-medium">Loading map data...</p>
      </div>
    </div>
  );
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  selectedLayers, 
  mapType, 
  selectedTime,
  searchQuery 
}) => {
  const { location, error } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  
  useEffect(() => {
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  // Handle zoom animations
  const handleMapCreated = (map: LeafletMap) => {
    setMapRef(map);
    
    // Add zoom animation class based on zoom level
    map.on('zoom', () => {
      const zoomLevel = map.getZoom();
      const mapElement = document.querySelector('.leaflet-container');
      
      if (mapElement) {
        if (zoomLevel > 12) {
          mapElement.classList.add('zoom-high');
        } else {
          mapElement.classList.remove('zoom-high');
        }
      }
    });
  };

  const getTileLayer = () => {
    if (mapType === 'satellite') {
      return (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          className="transition-opacity duration-700"
        />
      );
    }
    
    return (
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        className="transition-opacity duration-700"
      />
    );
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={mapCenter} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={handleMapCreated}
        className="map-container"
      >
        {getTileLayer()}
        <MapLoading />
        <ChangeMapView center={location ? [location.latitude, location.longitude] : null} searchQuery={searchQuery} />
        
        {location && (
          <Marker 
            position={[location.latitude, location.longitude]} 
            icon={DefaultIcon}
            zIndexOffset={1000}
          >
            <Popup className="location-popup">
              <div className="text-center p-1">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <MapPin size={16} className="text-blue-600" />
                  <p className="font-semibold">Your Location</p>
                </div>
                <p className="text-sm text-gray-600">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Map Layers */}
        {selectedLayers.includes('weather') && <WeatherLayer selectedTime={selectedTime} />}
        {selectedLayers.includes('aqi') && <AQILayer selectedTime={selectedTime} />}
        {selectedLayers.includes('wildfires') && <WildfireLayer selectedTime={selectedTime} />}
        {selectedLayers.includes('rainfall') && <RainfallLayer selectedTime={selectedTime} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
