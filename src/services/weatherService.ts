// Simulated weather data for demo purposes
// In a real application, you would use an actual weather API
export const getWeatherData = async (lat: number, lon: number, selectedTime?: Date | string | null) => {
  // Ensure selectedTime is a valid Date object
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Handle the selectedTime parameter to ensure it's a valid Date
  const now = (() => {
    if (!selectedTime) return new Date();
    
    const date = typeof selectedTime === 'string' ? new Date(selectedTime) : selectedTime;
    return isNaN(date.getTime()) ? new Date() : date;
  })();
  const month = now.getMonth(); // 0-11
  const hour = now.getHours(); // 0-23
  
  // Location-based temperature variance (hotter near equator, colder at poles)
  // Also add some variation based on longitude for more realistic data
  const latEffect = 30 * (1 - Math.abs(lat) / 90);
  const lonEffect = Math.sin(lon / 180 * Math.PI) * 5; // Add some variation based on longitude
  const latitudeEffect = latEffect + lonEffect;
  
  // Seasonal effects - northern vs southern hemisphere
  const isNorthernHemisphere = lat > 0;
  const seasonalOffset = isNorthernHemisphere 
    ? Math.sin((month / 12) * 2 * Math.PI) * 15 // Northern hemisphere seasons
    : Math.sin(((month + 6) / 12) * 2 * Math.PI) * 15; // Southern hemisphere (opposite season)

  // Time of day effect
  const timeOfDayEffect = Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 8;
  
  // Final temperature calculation
  let temp_c = latitudeEffect + seasonalOffset + timeOfDayEffect;
  temp_c = Math.round(temp_c * 10) / 10; // Round to 1 decimal place
  
  // Historical time adjustment - make older data slightly different
  if (selectedTime) {
    const selectedDate = typeof selectedTime === 'string' ? new Date(selectedTime) : selectedTime;
    if (!isNaN(selectedDate.getTime())) {
      const timeDiffHours = (new Date().getTime() - selectedDate.getTime()) / (1000 * 60 * 60);
      if (timeDiffHours > 0) {
        // Add some variation to historical data
        const variation = Math.sin(timeDiffHours / 24 * Math.PI) * 5;
        temp_c += variation;
        temp_c = Math.round(temp_c * 10) / 10;
      }
    }
  }
  
  // Weather condition (simplified)
  const conditions = [
    { text: "Sunny", code: 1000 },
    { text: "Partly cloudy", code: 1003 },
    { text: "Cloudy", code: 1006 },
    { text: "Overcast", code: 1009 },
    { text: "Mist", code: 1030 },
    { text: "Light rain", code: 1183 },
    { text: "Moderate rain", code: 1189 },
    { text: "Heavy rain", code: 1195 },
    { text: "Thunderstorm", code: 1276 },
    { text: "Light snow", code: 1210 },
    { text: "Moderate snow", code: 1213 },
    { text: "Heavy snow", code: 1216 }
  ];
  
  // Factor in time of day (more likely to be clear during day, cloudy at night)
  const isDaytime = hour >= 6 && hour <= 18;

  let conditionIndex: number;
  const rand = Math.random();

  // Snow conditions for very cold temperatures (more likely near equator and in certain seasons)
  if (temp_c < 2 && rand > 0.6) {
    conditionIndex = 9 + Math.floor(Math.random() * 3); // Snow conditions
  } else if (isDaytime && rand < 0.4) {
    // Sunny to partly cloudy during day
    conditionIndex = Math.floor(Math.random() * 2);
  } else if (rand < 0.7) {
    // Cloudy to misty
    conditionIndex = 2 + Math.floor(Math.random() * 3);
  } else {
    // Rain to thunderstorm
    conditionIndex = 5 + Math.floor(Math.random() * 4);
  }
  
  const condition = conditions[conditionIndex];
  
  // Generate humidity (higher near equator and with rain)
  const baseHumidity = 40 + Math.random() * 30;
  const humidityIncrease = conditionIndex >= 5 ? 30 : 0; // More humidity with rain
  const humidity = Math.min(95, Math.round(baseHumidity + humidityIncrease));
  
  // Generate wind speed (varies by location and increases with temperature difference)
  const tempDifferential = Math.abs(seasonalOffset) / 5;
  const wind_kph = Math.round((5 + Math.random() * 15 + tempDifferential) * 10) / 10;
  
  return {
    temp_c,
    humidity,
    wind_kph,
    condition
  };
};
