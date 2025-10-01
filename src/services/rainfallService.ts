// Simulated rainfall data for demo purposes
// In a real application, you would use actual rainfall/precipitation APIs
export const getRainfallData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Current date for season-appropriate rainfall patterns
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  // Generate global grid for rainfall data
  const grid = [];
  
  // Create a grid between -60 and 60 latitude (most populated areas)
  // with spacing of 5 degrees
  for (let lat = -60; lat <= 60; lat += 5) {
    for (let lon = -180; lon <= 180; lon += 5) {
      // Base rainfall probability
      let rainProbability = 0.3;
      
      // Increase rain probability in tropical regions
      if (Math.abs(lat) < 15) {
        rainProbability += 0.4; // More rain near equator
      }
      
      // Seasonal patterns - northern vs southern hemisphere
      const isNorthernHemisphere = lat > 0;
      if (isNorthernHemisphere) {
        // Northern hemisphere gets more rain in summer (months 5-8)
        if (month >= 5 && month <= 8) {
          rainProbability += 0.2;
        }
      } else {
        // Southern hemisphere gets more rain in their summer (months 11-2)
        if (month >= 11 || month <= 2) {
          rainProbability += 0.2;
        }
      }
      
      // Regional rainfall patterns (simplified)
      // Some areas are known to be rainier
      const knownRainyRegions = [
        { lat: 0, lon: -60, radius: 20 },   // Amazon
        { lat: 10, lon: 75, radius: 15 },   // Indian monsoon region
        { lat: 0, lon: 100, radius: 15 },   // Indonesia
        { lat: 45, lon: -120, radius: 10 }, // Pacific Northwest
        { lat: 50, lon: 0, radius: 10 },    // Northern Europe
      ];
      
      for (const region of knownRainyRegions) {
        const distance = Math.sqrt(
          Math.pow(lat - region.lat, 2) + Math.pow(lon - region.lon, 2)
        );
        
        if (distance < region.radius) {
          rainProbability += 0.3 * (1 - distance / region.radius);
        }
      }
      
      // Generate rainfall value
      if (Math.random() < rainProbability) {
        const baseAmount = Math.random() * 10; // Base amount in mm
        const intensityFactor = Math.random() < 0.2 ? 4 : 1; // Occasional heavy rain
        
        grid.push({
          lat,
          lon,
          value: Math.round(baseAmount * intensityFactor * 10) / 10
        });
      } else {
        grid.push({
          lat,
          lon,
          value: 0 // No rain
        });
      }
    }
  }
  
  return { grid };
};
