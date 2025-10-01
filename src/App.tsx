import React, { useState, useEffect } from 'react';
import './index.css';
import MapComponent from './components/Map/MapComponent';
import LayerControl from './components/Controls/LayerControl';
import Header from './components/Layout/Header';
import InfoPanel from './components/InfoPanel';
import SearchBar from './components/Controls/SearchBar';
import TimeSlider from './components/Controls/TimeSlider';
import StatisticsPanel from './components/Dashboard/StatisticsPanel';
import DataLegend from './components/Legend/DataLegend';
import ComparisonTool from './components/DataComparison/ComparisonTool';
import AmbientBackground from './components/Effects/AmbientBackground';
import { ArrowDownUp, BarChart4 } from 'lucide-react';

export function App(): React.ReactElement {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['weather']);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [showInfo, setShowInfo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showAmbientBackground] = useState(true);
  const currentWeather = 'clear';
  const currentAqi = 50;
  
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Set initial load animation
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleLayerToggle = (layer: string) => {
    setSelectedLayers((prev: string[]) => 
      prev.includes(layer)
        ? prev.filter((l: string) => l !== layer)
        : [...prev, layer]
    );
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger a geocoding service call
    console.log('Searching for:', query);
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
    // In a real app, this would refresh the data layers with historical data
    console.log('Time changed to:', time);
  };

  // Legends data
  const aqiLegendItems = [
    { color: '#00e400', label: 'Good (0-50)' },
    { color: '#ffff00', label: 'Moderate (51-100)' },
    { color: '#ff7e00', label: 'Unhealthy SG (101-150)' },
    { color: '#ff0000', label: 'Unhealthy (151-200)' },
    { color: '#99004c', label: 'Very Unhealthy (201-300)' },
    { color: '#7e0023', label: 'Hazardous (301+)' },
  ];

  const rainfallLegendItems = [
    { color: 'rgba(200, 250, 255, 0.5)', label: '< 1 mm' },
    { color: 'rgba(100, 200, 255, 0.5)', label: '1-2.5 mm' },
    { color: 'rgba(50, 150, 255, 0.6)', label: '2.5-5 mm' },
    { color: 'rgba(0, 100, 255, 0.7)', label: '5-10 mm' },
    { color: 'rgba(0, 50, 200, 0.7)', label: '10-20 mm' },
    { color: 'rgba(100, 0, 200, 0.7)', label: '20-40 mm' },
    { color: 'rgba(150, 0, 150, 0.7)', label: '40+ mm' },
  ];

  const wildfiresLegendItems = [
    { color: '#FF3300', label: 'High confidence' },
    { color: '#FF6600', label: 'Medium confidence' },
    { color: '#FF9900', label: 'Low confidence' },
  ];

  return (
    <div className="h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {isInitialLoad && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center z-[9999] animate-fadeOut">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl font-bold text-white flex items-center">
                Eco<span className="text-blue-300">Map</span>
                <div className="ml-2 w-12 h-12 border-4 border-blue-300 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-blue-200 text-lg">Loading environmental insights...</p>
          </div>
        </div>
      )}
      
      <Header 
        toggleInfo={toggleInfo} 
        toggleStats={() => setShowStats(!showStats)}
      />
      
      <main className="flex-1 flex relative overflow-hidden">
        <div className="h-full w-full relative">
          <MapComponent 
            selectedLayers={selectedLayers} 
            mapType={mapType}
            selectedTime={selectedTime}
            searchQuery={searchQuery}
          />
        </div>
        
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
          <LayerControl 
            selectedLayers={selectedLayers} 
            onLayerToggle={handleLayerToggle} 
            mapType={mapType}
            onMapTypeChange={setMapType}
          />
          <div className="flex gap-2 self-end">
            <button
              onClick={() => setShowComparison(true)}
              className="bg-white rounded-lg shadow-lg p-2.5 text-indigo-600 hover:text-indigo-800 transition-colors"
              title="Compare Data"
            >
              <ArrowDownUp size={20} />
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-white rounded-lg shadow-lg p-2.5 text-blue-600 hover:text-blue-800 transition-colors"
              title="View Statistics"
            >
              <BarChart4 size={20} />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <TimeSlider onTimeChange={handleTimeChange} />
        </div>
        
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 w-64">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
          <DataLegend 
            title="Air Quality Index" 
            items={aqiLegendItems} 
            visible={selectedLayers.includes('aqi')} 
          />
          <DataLegend 
            title="Rainfall" 
            items={rainfallLegendItems} 
            visible={selectedLayers.includes('rainfall')} 
          />
          <DataLegend 
            title="Wildfires" 
            items={wildfiresLegendItems} 
            visible={selectedLayers.includes('wildfires')} 
          />
        </div>
      </main>
      
      <AmbientBackground 
        weather={currentWeather} 
        aqi={currentAqi} 
        visible={showAmbientBackground}
      />
      {showInfo && <InfoPanel onClose={toggleInfo} />}
      <StatisticsPanel visible={showStats} onClose={() => setShowStats(false)} />
      <ComparisonTool visible={showComparison} onClose={() => setShowComparison(false)} />
    </div>
  );
}

export default App;
