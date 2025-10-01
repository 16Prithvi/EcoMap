import React, { useEffect, useRef, useState } from 'react';

interface AmbientBackgroundProps {
  weather?: string;
  aqi?: number;
  visible: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ 
  weather = 'clear', 
  aqi = 50,
  visible
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current || !visible) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Define colors based on weather and AQI
    let primaryColor, secondaryColor, accentColor;
    
    // Base colors on weather condition
    if (weather === 'clear' || weather === 'sunny') {
      primaryColor = 'rgba(135, 206, 250, 0.3)'; // Light blue
      secondaryColor = 'rgba(255, 223, 186, 0.3)'; // Light orange
      accentColor = 'rgba(255, 255, 255, 0.4)'; // White
    } else if (weather === 'cloudy' || weather === 'overcast') {
      primaryColor = 'rgba(169, 169, 169, 0.3)'; // Gray
      secondaryColor = 'rgba(220, 220, 220, 0.3)'; // Light gray
      accentColor = 'rgba(200, 200, 200, 0.4)'; // Silver
    } else if (weather === 'rain' || weather === 'drizzle') {
      primaryColor = 'rgba(105, 105, 105, 0.3)'; // Dark gray
      secondaryColor = 'rgba(100, 149, 237, 0.3)'; // Cornflower blue
      accentColor = 'rgba(176, 196, 222, 0.4)'; // Light steel blue
    } else if (weather === 'snow') {
      primaryColor = 'rgba(240, 248, 255, 0.3)'; // Alice blue
      secondaryColor = 'rgba(230, 230, 250, 0.3)'; // Lavender
      accentColor = 'rgba(255, 255, 255, 0.4)'; // White
    } else if (weather === 'fog' || weather === 'mist') {
      primaryColor = 'rgba(220, 220, 220, 0.3)'; // Light gray
      secondaryColor = 'rgba(211, 211, 211, 0.3)'; // Light gray
      accentColor = 'rgba(192, 192, 192, 0.4)'; // Silver
    } else if (weather === 'storm' || weather === 'thunder') {
      primaryColor = 'rgba(72, 61, 139, 0.3)'; // Dark slate blue
      secondaryColor = 'rgba(123, 104, 238, 0.3)'; // Medium slate blue
      accentColor = 'rgba(255, 255, 0, 0.2)'; // Yellow
    } else {
      primaryColor = 'rgba(135, 206, 250, 0.3)'; // Default light blue
      secondaryColor = 'rgba(176, 196, 222, 0.3)'; // Default light steel blue
      accentColor = 'rgba(255, 255, 255, 0.4)'; // Default white
    }
    
    // Modify colors based on AQI
    if (aqi > 150) {
      // Poor air quality - add reddish tint
      primaryColor = 'rgba(178, 34, 34, 0.2)'; // Firebrick with low opacity
      secondaryColor = 'rgba(139, 0, 0, 0.2)'; // Dark red with low opacity
      accentColor = 'rgba(255, 165, 0, 0.2)'; // Orange with low opacity
    } else if (aqi > 100) {
      // Moderate air quality - add yellowish tint
      const currentPrimary = primaryColor;
      primaryColor = secondaryColor;
      secondaryColor = 'rgba(255, 215, 0, 0.2)'; // Gold with low opacity
      accentColor = currentPrimary;
    }
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create floating particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
    }[] = [];
    
    // Number of particles depends on screen size
    const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: accentColor,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw gradient background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgba', 'rgba');
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, weather, aqi, visible]);
  
  if (!visible) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5] opacity-30"
    />
  );
};

export default AmbientBackground;
