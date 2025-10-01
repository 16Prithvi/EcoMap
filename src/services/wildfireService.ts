

// Simulated wildfire data for demo purposes
// In a real application, you would use actual wildfire monitoring APIs
export const getWildfireData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Current date for season-appropriate wildfires
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  // Wildfire locations - more common in certain regions and seasons
  // Northern hemisphere summer (May-Oct): months 4-9
  // Southern hemisphere summer (Nov-Apr): months 10-11, 0-3
  
  const northernWildfires = [
    { 
      id: "nf1", 
      location: { lat: 37.7749, lon: -122.4194 }, 
      name: "Sierra Nevada Fire",
      area: 1200,
      started: "2025-06-18T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "nf2", 
      location: { lat: 34.0522, lon: -118.2437 }, 
      name: "Angeles National Forest Fire",
      area: 800,
      started: "2025-07-05T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "nf3", 
      location: { lat: 39.7392, lon: -104.9903 }, 
      name: "Rocky Mountain Blaze",
      area: 650,
      started: "2025-06-29T00:00:00Z", 
      confidence: "medium" as const
    },
    { 
      id: "nf4", 
      location: { lat: 44.0682, lon: -114.7420 }, 
      name: "Sawtooth Fire",
      area: 1500,
      started: "2025-07-01T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "nf5", 
      location: { lat: 46.8797, lon: -110.3626 }, 
      name: "Montana Range Fire",
      area: 450,
      started: "2025-07-08T00:00:00Z", 
      confidence: "medium" as const
    },
    { 
      id: "nf6", 
      location: { lat: 37.0902, lon: -95.7129 }, 
      name: "Kansas Prairie Fire",
      area: 300,
      started: "2025-07-10T00:00:00Z", 
      confidence: "low" as const
    }
  ];
  
  const southernWildfires = [
    { 
      id: "sf1", 
      location: { lat: -33.8688, lon: 151.2093 }, 
      name: "Blue Mountains Blaze",
      area: 2200,
      started: "2024-12-15T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "sf2", 
      location: { lat: -37.8136, lon: 144.9631 }, 
      name: "Victorian Alpine Fire",
      area: 1800,
      started: "2025-01-05T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "sf3", 
      location: { lat: -35.2809, lon: 149.1300 }, 
      name: "Canberra Region Fire",
      area: 950,
      started: "2025-01-22T00:00:00Z", 
      confidence: "medium" as const
    },
    { 
      id: "sf4", 
      location: { lat: -23.5505, lon: -46.6333 }, 
      name: "Brazilian Forest Fire",
      area: 1600,
      started: "2024-02-28T00:00:00Z", 
      confidence: "high" as const
    },
    { 
      id: "sf5", 
      location: { lat: -41.2865, lon: 174.7762 }, 
      name: "New Zealand Bush Fire",
      area: 350,
      started: "2025-03-05T00:00:00Z", 
      confidence: "low" as const
    }
  ];
  
  // Choose wildfires based on current season
  const isNorthernSummer = month >= 4 && month <= 9;
  let activeWildfires = [];
  
  if (isNorthernSummer) {
    activeWildfires = [...northernWildfires];
    // Add a few southern hemisphere fires (they can still happen in winter, just fewer)
    if (Math.random() > 0.7) {
      activeWildfires.push(southernWildfires[Math.floor(Math.random() * southernWildfires.length)]);
    }
  } else {
    activeWildfires = [...southernWildfires];
    // Add a few northern hemisphere fires
    if (Math.random() > 0.7) {
      activeWildfires.push(northernWildfires[Math.floor(Math.random() * northernWildfires.length)]);
    }
  }
  
  return activeWildfires;
};
