import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePlanetWeight, getAccessiblePlanets, PREMIUM_TIERS } from './utils/planets';
import { getRandomAstronomyPicture, getPlanetImage } from './utils/nasaApi';
import PlanetCard from './components/PlanetCard';
import { planets } from './utils/planets';

function App() {
  const [earthWeight, setEarthWeight] = useState('70');
  const [planetWeights, setPlanetWeights] = useState([]);
  const [currentPlanet, setCurrentPlanet] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomApod, setRandomApod] = useState(null);
  const [apodLoading, setApodLoading] = useState(false);
  const [planetImagesStatus, setPlanetImagesStatus] = useState({});
  const [activeTab, setActiveTab] = useState('planets'); // 'planets', 'apod'
  const [showHome, setShowHome] = useState(true);
  const [premiumTier, setPremiumTier] = useState(() => {
    // Check if there's a saved premium tier in localStorage
    const savedTier = localStorage.getItem('gravitas_premium_tier');
    return savedTier || PREMIUM_TIERS.FREE;
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save premium tier to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gravitas_premium_tier', premiumTier);
  }, [premiumTier]);

  // Initialize planet weights with default value
  useEffect(() => {
    // Don't auto-calculate on load - wait for user to click Calculate
    // handleCalculate(null, 70);
  }, []);

  // Handle subscription changes
  useEffect(() => {
    if (planetWeights.length > 0) {
      // When premium status changes, recalculate visible planets
      const recalculatedPlanets = getAccessiblePlanets(premiumTier);
      const calculatedWeights = recalculatedPlanets.map(planet => ({
        ...planet,
        weight: parseFloat((parseFloat(earthWeight) * planet.gravitationalForce).toFixed(1))
      }));

      setPlanetWeights(calculatedWeights);

      // Ensure current planet is still valid
      if (currentPlanet >= calculatedWeights.length) {
        setCurrentPlanet(0);
      }
    }
  }, [premiumTier]);

  // Preload planet images and track loading status
  useEffect(() => {
    const imageStatus = {};

    planets.forEach(planet => {
      const img = new Image();
      img.src = planet.image;

      img.onload = () => {
        imageStatus[planet.name] = true;
        setPlanetImagesStatus(prev => ({...prev, [planet.name]: true}));
      };

      img.onerror = () => {
        console.error(`Failed to load image for ${planet.name}`);
        imageStatus[planet.name] = false;
        setPlanetImagesStatus(prev => ({...prev, [planet.name]: false}));
      };
    });
  }, []);

  const handleCalculate = async (e, defaultWeight = null) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const weight = defaultWeight || parseFloat(earthWeight);
      if (isNaN(weight) || weight <= 0) {
        throw new Error('Please enter a valid weight greater than 0');
      }

      // Get only planets accessible based on current subscription tier
      const accessiblePlanets = getAccessiblePlanets(premiumTier);
      const results = accessiblePlanets.map(planet => ({
        ...planet,
        weight: parseFloat((weight * planet.gravitationalForce).toFixed(1))
      }));

      setPlanetWeights(results);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomApod = async () => {
    if (randomApod) {
      setActiveTab('apod');
      return;
    }

    setApodLoading(true);
    try {
      const apodData = await getRandomAstronomyPicture();
      if (apodData) {
        setRandomApod(apodData);
        setActiveTab('apod');
      } else {
        throw new Error('Failed to load Astronomy Picture of the Day');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setApodLoading(false);
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-[url('/stars.svg')] bg-cover overflow-hidden flex flex-col relative">
      {/* Star particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-gray-900/90"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Logo */}
        <motion.div
          className="w-32 h-32 mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-700"></div>
          <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-white opacity-70"></div>
          <div className="absolute w-full h-full rounded-full animate-spin-slow opacity-50" style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(147, 51, 234, 0.3) 50%, transparent 100%)',
            borderRadius: '50%'
          }}></div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Gravitas
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl text-center leading-relaxed"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Explore the fascinating effects of gravity across our solar system. Discover how your weight changes on different planets and learn about the fundamental force that shapes our universe.
        </motion.p>

        {/* Feature grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">8 Planets</h3>
            <p className="text-gray-400">Explore all planets in our solar system with accurate gravitational data</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Weight Calculator</h3>
            <p className="text-gray-400">Instantly convert your Earth weight to any planet in our solar system</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">NASA Images</h3>
            <p className="text-gray-400">View stunning astronomy photos from NASA's collection</p>
          </div>
        </motion.div>

        {/* Call to action button */}
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 hover:scale-105"
          onClick={() => setShowHome(false)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Launch Explorer
        </motion.button>
      </div>
    </div>
  );

  const MainApp = () => (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden flex flex-col">
      {/* Stars Background */}
      <div className="fixed inset-0 bg-[url('/stars.svg')] opacity-40 pointer-events-none"></div>

      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white absolute top-1 left-1"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gravitas
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-4 py-2 mx-1 rounded-md transition-all ${
              activeTab === 'planets'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Planet Weights
          </button>
          <button
            onClick={randomApod ? () => setActiveTab('apod') : handleRandomApod}
            className={`px-4 py-2 mx-1 rounded-md transition-all ${
              activeTab === 'apod'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {apodLoading ? 'Loading...' : 'Space Photo'}
          </button>
          <button
            onClick={() => setShowHome(true)}
            className="ml-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/60 backdrop-blur-md border-b border-gray-800"
          >
            <div className="flex flex-col p-3">
              <button
                onClick={() => {
                  setActiveTab('planets');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 my-1 rounded-md transition-all text-left ${
                  activeTab === 'planets'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Planet Weights
              </button>
              <button
                onClick={() => {
                  randomApod ? setActiveTab('apod') : handleRandomApod();
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 my-1 rounded-md transition-all text-left ${
                  activeTab === 'apod'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {apodLoading ? 'Loading...' : 'Space Photo'}
              </button>
              <button
                onClick={() => {
                  setShowHome(true);
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 my-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all flex items-center text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'planets' && (
            <motion.div
              key="planets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex"
            >
              {/* Left Panel - Calculator */}
              <div className="w-[320px] bg-gray-900/70 backdrop-blur-md border-r border-gray-800 p-5 h-full overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Calculator</h2>

                {planetWeights.length === 0 ? (
                  // Clean centered initial UI
                  <div className="flex flex-col items-center justify-center h-[70vh]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-white text-lg font-medium mb-2">Discover Your Weight</h3>
                      <p className="text-gray-400 text-sm">Enter your Earth weight to see how much you would weigh on other planets</p>
                    </div>
                    <div className="w-full max-w-[220px] mx-auto">
                      <input
                        type="number"
                        value={earthWeight}
                        onChange={(e) => setEarthWeight(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                        placeholder="Enter your weight"
                        required
                        min="0"
                        step="1"
                      />
                      <button
                        onClick={(e) => handleCalculate(e)}
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium text-lg transition ${
                          isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Calculating...
                          </div>
                        ) : 'Calculate'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Original UI after calculation
                  <>
                    <form onSubmit={handleCalculate} className="space-y-5">
                      <div>
                        <label className="text-sm text-gray-300 block mb-2">Weight on Earth (kg)</label>
                        <input
                          type="number"
                          value={earthWeight}
                          onChange={(e) => setEarthWeight(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter your weight"
                          required
                          min="0"
                          step="1"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium text-lg transition ${
                          isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Calculating...
                          </div>
                        ) : 'Calculate'}
                      </button>
                    </form>

                    {/* Add Verify Payment Button when needed */}
                    {localStorage.getItem('gravitas_selected_plan') && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            const storedPlan = localStorage.getItem('gravitas_selected_plan');
                            if (storedPlan) {
                              setPremiumTier(storedPlan);
                              localStorage.removeItem('gravitas_selected_plan');
                              localStorage.setItem('gravitas_premium_tier', storedPlan);
                              setError('Payment verified successfully! Premium features unlocked.');
                            }
                          }}
                          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
                        >
                          Verify Payment
                        </button>
                      </div>
                    )}

                    {error && (
                      <div className={`mt-4 text-sm font-medium py-2 px-3 rounded-md ${
                        error.includes('successfully')
                          ? 'text-green-400 bg-green-900/30 border border-green-900/50'
                          : 'text-red-400 bg-red-900/30 border border-red-900/50'
                      }`}>
                        {error}
                      </div>
                    )}

                    {/* Planet Selection */}
                    <div className="mt-8">
                      <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Select Planet</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {planetWeights.map((planet, index) => (
                          <button
                            key={planet.name}
                            onClick={() => setCurrentPlanet(index)}
                            className={`p-2 rounded-md text-xs transition relative ${
                              currentPlanet === index
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            } ${planet.isPremium && !isPremiumUser ? 'opacity-60' : ''}`}
                            disabled={planet.isPremium && !isPremiumUser}
                          >
                            {planet.name}
                            {planet.isPremium && !isPremiumUser && (
                              <span className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-3 h-3"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Premium Planets Upsell */}
                    {premiumTier === PREMIUM_TIERS.FREE && (
                      <div className="mt-6 bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-4 py-3 border-b border-gray-700/50">
                          <h3 className="text-white font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Premium Planets
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-300 text-sm mb-4">Unlock additional celestial bodies with premium plans. Choose the plan that's right for you!</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-900/30 to-indigo-800/30 px-3 py-2 rounded">
                              <div className="flex items-center">
                                <span className="text-indigo-300 font-medium text-sm">Basic</span>
                                <span className="ml-2 bg-indigo-900/50 px-1.5 py-0.5 rounded text-xs text-indigo-300">3 bodies</span>
                              </div>
                              <span className="text-white font-medium">2€</span>
                            </div>

                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-purple-800/30 px-3 py-2 rounded">
                              <div className="flex items-center">
                                <span className="text-purple-300 font-medium text-sm">Plus</span>
                                <span className="ml-2 bg-purple-900/50 px-1.5 py-0.5 rounded text-xs text-purple-300">8 bodies</span>
                              </div>
                              <span className="text-white font-medium">4€</span>
                            </div>

                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-900/30 to-amber-800/30 px-3 py-2 rounded">
                              <div className="flex items-center">
                                <span className="text-yellow-300 font-medium text-sm">Explorer</span>
                                <span className="ml-2 bg-yellow-900/50 px-1.5 py-0.5 rounded text-xs text-yellow-300">14 bodies</span>
                              </div>
                              <span className="text-white font-medium">7€</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-md text-sm font-medium transition"
                          >
                            View Premium Plans
                          </button>
                        </div>
                      </div>
                    )}

                    {premiumTier !== PREMIUM_TIERS.FREE && premiumTier !== PREMIUM_TIERS.EXPLORER && (
                      <div className="mt-6 bg-gradient-to-br from-indigo-900/20 to-purple-800/20 rounded-lg border border-indigo-700/30">
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-white font-medium">
                              {premiumTier === PREMIUM_TIERS.BASIC ? 'Basic' : 'Plus'} Plan Active
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">Upgrade to the Explorer plan to access all 22 celestial bodies, including Black Hole and dwarf planets!</p>
                          <button
                            onClick={() => {
                              setSelectedPlan(PREMIUM_TIERS.EXPLORER);
                              setShowPaymentModal(true);
                            }}
                            className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white py-2 rounded-md text-sm font-medium transition"
                          >
                            Upgrade to Explorer
                          </button>
                        </div>
                      </div>
                    )}

                    {premiumTier === PREMIUM_TIERS.EXPLORER && (
                      <div className="mt-6 bg-gradient-to-br from-yellow-900/20 to-amber-800/20 rounded-lg border border-yellow-700/30">
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-white font-medium">Explorer Plan Active</span>
                          </div>
                          <p className="text-gray-300 text-sm">You have unlocked all 22 celestial bodies including the most exotic objects in our universe. Enjoy your cosmic journey!</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Panel - Planet Display */}
              <div className="flex-1 bg-gray-950/50 backdrop-blur-md overflow-y-auto p-4">
                {planetWeights.length > 0 && (
                  <AnimatePresence mode="wait">
                    <PlanetCard
                      key={currentPlanet}
                      planet={planetWeights[currentPlanet]}
                    />
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'apod' && randomApod && (
            <motion.div
              key="apod"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto bg-gray-950/50 backdrop-blur-md p-6"
            >
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800">
                  <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white">{randomApod.title}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(randomApod.date).toLocaleDateString()} - NASA Astronomy Picture of the Day
                    </p>
                  </div>

                  <div className="border-b border-gray-800">
                    {randomApod.media_type === 'video' ? (
                      <div className="relative aspect-video">
                        <iframe
                          src={randomApod.url}
                          title={randomApod.title}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <img
                        src={randomApod.url}
                        alt={randomApod.title}
                        className="w-full h-auto"
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{randomApod.explanation}</p>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleRandomApod}
                        disabled={apodLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        {apodLoading ? 'Loading...' : 'New Random Photo'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md text-gray-500 py-3 px-6 text-xs border-t border-gray-800">
        <div className="flex justify-between items-center">
          <p>Gravitas | Using NASA planetary data</p>
          <p className="text-indigo-400">Made with love by Ihab Elbani</p>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Unlock Premium Planets</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-300 text-sm mb-6">Explore more celestial bodies and enhance your cosmic journey with our premium subscription plans. Choose the plan that best fits your astronomical curiosity!</p>

              {/* Subscription Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Basic Plan */}
                <div
                  className={`border rounded-xl overflow-hidden ${selectedPlan === PREMIUM_TIERS.BASIC
                    ? 'border-2 border-indigo-500 bg-indigo-900/20'
                    : 'border-gray-700 bg-gray-800/50'}
                    transition-all cursor-pointer hover:bg-gray-800 hover:border-gray-600`}
                  onClick={() => setSelectedPlan(PREMIUM_TIERS.BASIC)}
                >
                  <div className="p-4 border-b border-gray-700">
                    <h4 className="text-lg font-semibold text-white">Basic Plan</h4>
                    <div className="mt-1 flex items-end">
                      <span className="text-2xl font-bold text-white">2€</span>
                      <span className="text-gray-400 text-sm ml-1">one-time</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">All standard planets</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Access to Pluto, Moon, and Ceres</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <svg className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Additional moons and dwarf planets</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <svg className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Exotic celestial bodies</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Plus Plan */}
                <div
                  className={`border rounded-xl overflow-hidden ${selectedPlan === PREMIUM_TIERS.PLUS
                    ? 'border-2 border-purple-500 bg-purple-900/20'
                    : 'border-gray-700 bg-gray-800/50'}
                    transition-all cursor-pointer hover:bg-gray-800 hover:border-gray-600`}
                  onClick={() => setSelectedPlan(PREMIUM_TIERS.PLUS)}
                >
                  <div className="p-4 border-b border-gray-700">
                    <h4 className="text-lg font-semibold text-white">Plus Plan</h4>
                    <div className="mt-1 flex items-end">
                      <span className="text-2xl font-bold text-white">4€</span>
                      <span className="text-gray-400 text-sm ml-1">one-time</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">All standard planets</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Access to Pluto, Moon, and Ceres</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Jupiter & Saturn moons: Europa, Titan, Io, Ganymede and more</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <svg className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Exotic celestial bodies</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Explorer Plan */}
                <div
                  className={`border rounded-xl overflow-hidden ${selectedPlan === PREMIUM_TIERS.EXPLORER
                    ? 'border-2 border-yellow-500 bg-yellow-900/20'
                    : 'border-gray-700 bg-gray-800/50'}
                    transition-all cursor-pointer hover:bg-gray-800 hover:border-gray-600`}
                  onClick={() => setSelectedPlan(PREMIUM_TIERS.EXPLORER)}
                >
                  <div className="p-4 border-b border-gray-700 relative overflow-hidden">
                    <div className="absolute -right-8 -top-2 bg-yellow-500 text-black text-xs font-bold py-1 px-8 transform rotate-45">
                      BEST VALUE
                    </div>
                    <h4 className="text-lg font-semibold text-white">Explorer Plan</h4>
                    <div className="mt-1 flex items-end">
                      <span className="text-2xl font-bold text-white">7€</span>
                      <span className="text-gray-400 text-sm ml-1">one-time</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">All standard planets</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Access to all planets in Plus plan</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Exotic objects: Sun, Black Hole</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">All dwarf planets: Eris, Makemake, Haumea</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              {selectedPlan ? (
                <div className="space-y-3">
                  <a
                    href={`https://www.paypal.me/IhabElbani/${selectedPlan === PREMIUM_TIERS.BASIC ? 2 : selectedPlan === PREMIUM_TIERS.PLUS ? 4 : 7}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-center font-medium transition"
                    onClick={() => {
                      // Save the selected plan to localStorage
                      localStorage.setItem('gravitas_selected_plan', selectedPlan);
                      // Just close the modal when clicking Pay
                      setShowPaymentModal(false);
                      // Show message about verifying payment
                      setError("After payment, please click 'Verify Payment' button to unlock premium features");
                    }}
                  >
                    Pay with PayPal
                  </a>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Your plan: {selectedPlan === PREMIUM_TIERS.BASIC ? 'Basic' : selectedPlan === PREMIUM_TIERS.PLUS ? 'Plus' : 'Explorer'}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-300">
                  Please select a plan to continue
                </div>
              )}

              <div className="mt-4 text-center text-xs text-gray-500">
                After payment, reload the page to access premium planets. All purchases are final.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {showHome ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HomePage />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MainApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
