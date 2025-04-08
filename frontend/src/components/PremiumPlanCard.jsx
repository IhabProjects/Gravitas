import React from 'react';
import { motion } from 'framer-motion';
import { PREMIUM_TIERS } from '../utils/planets';

const PremiumPlanCard = ({ plan, isActive, onSelect }) => {
  const getPlanDetails = () => {
    switch (plan) {
      case PREMIUM_TIERS.FREE:
        return {
          title: 'Free Tier',
          price: '€0',
          features: [
            'Basic celestial bodies',
            'Mercury, Venus, Earth, Mars',
            'Jupiter, Saturn, Uranus, Neptune',
            'Basic weight calculator'
          ],
          color: 'from-gray-600 to-gray-800',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
      case PREMIUM_TIERS.BASIC:
        return {
          title: 'Basic Explorer',
          price: '€2',
          features: [
            'Everything in Free Tier',
            'Dwarf planet: Pluto',
            'Earth\'s Moon',
            'Dwarf planet: Ceres'
          ],
          color: 'from-blue-600 to-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case PREMIUM_TIERS.PLUS:
        return {
          title: 'Plus Explorer',
          price: '€4',
          features: [
            'Everything in Basic Tier',
            'Jupiter\'s moons: Europa, Io, Ganymede',
            'Saturn\'s moons: Titan, Enceladus',
            'Enhanced gravity simulation'
          ],
          color: 'from-purple-600 to-purple-800',
          buttonColor: 'bg-purple-600 hover:bg-purple-700'
        };
      case PREMIUM_TIERS.EXPLORER:
        return {
          title: 'Ultimate Explorer',
          price: '€7',
          features: [
            'Everything in Plus Tier',
            'The Sun',
            'Dwarf planets: Eris, Makemake, Haumea',
            'Neptune\'s moon: Triton',
            'Black Hole simulation'
          ],
          color: 'from-pink-600 to-pink-800',
          buttonColor: 'bg-pink-600 hover:bg-pink-700'
        };
      default:
        return {
          title: 'Unknown Plan',
          price: '€?',
          features: ['Details unavailable'],
          color: 'from-gray-600 to-gray-800',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const details = getPlanDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden shadow-lg ${isActive ? 'ring-4 ring-yellow-400' : ''}`}
    >
      <div className={`bg-gradient-to-r ${details.color} px-4 sm:px-6 py-5 sm:py-8 text-white`}>
        <h3 className="text-lg sm:text-xl font-bold mb-2">{details.title}</h3>
        <div className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">{details.price}</div>
        <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
          {details.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4">
        <button
          onClick={() => onSelect(plan)}
          className={`w-full ${details.buttonColor} text-white py-2 px-3 sm:px-4 rounded-md font-medium transition-colors duration-200 shadow-md text-sm sm:text-base`}
        >
          {isActive ? 'Current Plan' : 'Select Plan'}
        </button>
      </div>
    </motion.div>
  );
};

export default PremiumPlanCard;
