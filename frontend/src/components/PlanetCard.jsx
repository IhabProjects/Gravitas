import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fallback images for planets that frequently have loading issues
const FALLBACK_IMAGES = {
  Ganymede: 'https://science.nasa.gov/wp-content/uploads/2023/09/ganymede_true_color.jpg',
  Haumea: 'https://science.nasa.gov/wp-content/uploads/2023/09/haumea_hubble.jpg',
};

// Fallback colors for each planet if image fails to load
const PLANET_COLORS = {
  Mercury: 'bg-gray-400',
  Venus: 'bg-yellow-500',
  Earth: 'bg-blue-500',
  Mars: 'bg-red-500',
  Jupiter: 'bg-orange-400',
  Saturn: 'bg-yellow-300',
  Uranus: 'bg-teal-400',
  Neptune: 'bg-blue-700',
  Pluto: 'bg-gray-300',
  Moon: 'bg-gray-200',
  Ceres: 'bg-gray-400',
  Europa: 'bg-blue-100',
  Titan: 'bg-yellow-800',
  Io: 'bg-yellow-600',
  Ganymede: 'bg-gray-400',
  Enceladus: 'bg-blue-50',
  Sun: 'bg-yellow-500',
  Eris: 'bg-gray-300',
  Triton: 'bg-blue-200',
  Makemake: 'bg-red-300',
  Haumea: 'bg-gray-200',
  'Black Hole': 'bg-black'
};

// Special animations for certain cosmic objects
const SPECIAL_EFFECTS = {
  'Black Hole': {
    containerClass: "black-hole-container",
    specialAnimation: true
  },
  'Sun': {
    containerClass: "sun-container",
    specialAnimation: true
  }
};

const PlanetCard = ({ planet }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'details', 'funFact'
  const starsContainerRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(planet.image);

  // Handle image load error
  const handleImageError = () => {
    // Try to use fallback image for problematic planets
    if (FALLBACK_IMAGES[planet.name] && imageSrc !== FALLBACK_IMAGES[planet.name]) {
      console.log(`Using fallback image for ${planet.name}`);
      setImageSrc(FALLBACK_IMAGES[planet.name]);
      return;
    }

    // If no fallback available or fallback also failed
    setImageError(true);
    setLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    // Reset state when planet changes
    setImageLoaded(false);
    setImageError(false);
    setLoading(true);
    setImageSrc(planet.image);

    // Preload the image
    const img = new Image();
    img.src = planet.image;
    img.onload = () => {
      setImageLoaded(true);
      setLoading(false);
    };
    img.onerror = () => {
      console.error(`Failed to load image for ${planet.name}`);

      // Try fallback image
      if (FALLBACK_IMAGES[planet.name]) {
        console.log(`Attempting fallback image for ${planet.name}`);
        setImageSrc(FALLBACK_IMAGES[planet.name]);

        const fallbackImg = new Image();
        fallbackImg.src = FALLBACK_IMAGES[planet.name];
        fallbackImg.onload = () => {
          setImageLoaded(true);
          setLoading(false);
        };
        fallbackImg.onerror = () => {
          setImageError(true);
          setLoading(false);
        };
      } else {
        setImageError(true);
        setLoading(false);
      }
    };

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [planet]);

  const handlePlanetClick = () => {
    setIsRotating(!isRotating);
  };

  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        size: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        animationDuration: Math.random() * 3 + 2,
      });
    }
    return stars;
  };

  const stars = generateStars(20);

  // Get fallback color for the planet
  const getPlanetFallbackColor = () => {
    return PLANET_COLORS[planet.name] || 'bg-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden flex-1 flex flex-col">
        {/* Image and Name Section */}
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={starsContainerRef}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${
                  PLANET_COLORS[planet.name] || '#1a1f36'
                }33 0%, #00000000 70%)`,
              }}
            >
              {stars.map((star, index) => (
                <div
                  key={index}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: star.size,
                    height: star.size,
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    opacity: star.opacity,
                    animation: `twinkle ${star.animationDuration}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6 px-4 sm:py-8 sm:px-6 relative z-10">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <img
                src={imageSrc}
                alt={planet.name}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center">
              {planet.name}
            </h2>

            {/* Weight display - Prominently shown near top */}
            {planet.weight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center w-full px-4"
              >
                <div className="text-gray-400 text-sm mb-1">Your weight</div>
                <div className="font-bold text-3xl sm:text-5xl bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text truncate">
                  {planet.weight} kg
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-t border-b border-gray-800 bg-black/30">
          <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('fun-facts')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'fun-facts'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Fun Facts
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p className="text-gray-300 leading-relaxed">{planet.description}</p>

                {/* Key facts in cards for better mobile display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Mass</div>
                    <div className="text-white font-medium">{planet.mass} × 10<sup>24</sup> kg</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Gravity</div>
                    <div className="text-white font-medium">{(planet.gravitationalForce * 9.8).toFixed(1)} m/s²</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Distance from Sun</div>
                    <div className="text-white font-medium">{planet.distanceFromSun} million km</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Day Length</div>
                    <div className="text-white font-medium">{planet.dayLength} hours</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">Diameter</div>
                    <div className="text-white font-medium text-sm sm:text-lg">{planet.diameter.toLocaleString()} km</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                      {(planet.diameter / 12756).toFixed(2)}× Earth
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">Mass</div>
                    <div className="text-white font-medium text-sm sm:text-lg">{planet.mass.toLocaleString()} × 10<sup>24</sup> kg</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                      {(planet.mass / 5.97).toFixed(3)}× Earth
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                  <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-2">Orbital Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <div className="text-gray-400 text-[10px] sm:text-xs">Distance from Sun</div>
                      <div className="text-white text-sm sm:text-base">{planet.distanceFromSun.toLocaleString()} million km</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] sm:text-xs">Day Length</div>
                      <div className="text-white text-sm sm:text-base">{planet.dayLength} hours</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] sm:text-xs">Year Length</div>
                      <div className="text-white text-sm sm:text-base">{planet.yearLength} Earth days</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] sm:text-xs">Compared to Earth</div>
                      <div className="text-white text-sm sm:text-base">{(planet.yearLength / 365.25).toFixed(2)} Earth years</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'fun-facts' && (
              <motion.div
                key="fun-facts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4 sm:p-6 border border-indigo-800/30">
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div className="bg-indigo-600/30 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Did you know?</h3>
                  </div>
                  <blockquote className="text-gray-200 text-base sm:text-lg leading-relaxed italic">
                    "{planet.funFact}"
                  </blockquote>

                  <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Swipe or use the tabs above to see more information about {planet.name}.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanetCard;
