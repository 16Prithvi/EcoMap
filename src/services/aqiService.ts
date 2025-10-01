// Simulated AQI data for demo purposes
// In a real application, you would use an actual air quality API
export const getAQIData = async (lat: number, lon: number) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate realistic AQI data based on location
  // Higher pollution in urban areas (based on well-known city coordinates)
  const knownCities = [
    { name: "Beijing", lat: 39.9042, lon: 116.4074, pollutionFactor: 2.5 },
    { name: "Delhi", lat: 28.6139, lon: 77.2090, pollutionFactor: 2.8 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, pollutionFactor: 1.6 },
    { name: "Cairo", lat: 30.0444, lon: 31.2357, pollutionFactor: 2.2 },
    { name: "London", lat: 51.5074, lon: -0.1278, pollutionFactor: 1.2 },
    { name: "Paris", lat: 48.8566, lon: 2.3522, pollutionFactor: 1.3 },
    { name: "New York", lat: 40.7128, lon: -74.0060, pollutionFactor: 1.4 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, pollutionFactor: 1.3 },
  ];
  
  // Find the closest city for pollution factor
  let pollutionFactor = 1;
  let closestDistance = Infinity;
  
  for (const city of knownCities) {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
    );
    
    if (distance < closestDistance) {
      closestDistance = distance;
      pollutionFactor = city.pollutionFactor;
    }
  }
  
  // Apply distance factor - pollution decreases as you move away from city centers
  const distanceFactor = Math.min(1, 0.5 + (1 / (1 + closestDistance * 5)));
  
  // Generate baseline AQI (normal distribution around 50)
  const baseAqi = 30 + Math.random() * 40;
  
  // Apply pollution and distance factors
  const aqi = Math.round(baseAqi * pollutionFactor * distanceFactor);
  
  // Generate pollutant data
  const pm25 = Math.round(aqi * 0.4 * (0.9 + Math.random() * 0.2));
  const pm10 = Math.round(aqi * 0.8 * (0.9 + Math.random() * 0.2));
  const o3 = Math.round(30 + Math.random() * 40 * (aqi / 100));
  const no2 = Math.round(20 + Math.random() * 60 * (aqi / 100));
  
  return {
    aqi,
    pollutants: {
      pm25,
      pm10,
      o3,
      no2
    }
  };
};
