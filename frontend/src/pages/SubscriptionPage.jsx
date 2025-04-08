import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PremiumPlanCard from '../components/PremiumPlanCard';
import { PREMIUM_TIERS } from '../utils/planets';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(PREMIUM_TIERS.FREE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Here you would typically fetch the user's current plan from an API
    // For demo purposes, we'll just use the FREE tier as default
    const fetchUserPlan = async () => {
      // Simulating API call
      setTimeout(() => {
        setSelectedPlan(PREMIUM_TIERS.FREE);
      }, 500);
    };

    fetchUserPlan();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(`Successfully subscribed to ${getPlanName(selectedPlan)}!`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1500);
  };

  const getPlanName = (plan) => {
    switch (plan) {
      case PREMIUM_TIERS.FREE: return 'Free Tier';
      case PREMIUM_TIERS.BASIC: return 'Basic Explorer';
      case PREMIUM_TIERS.PLUS: return 'Plus Explorer';
      case PREMIUM_TIERS.EXPLORER: return 'Ultimate Explorer';
      default: return 'Unknown Plan';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text px-2">
          Upgrade Your Gravitational Journey
        </h1>
        <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          Unlock more celestial bodies and explore the wonders of our universe with our premium plans.
        </p>
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 sm:mb-6 text-center mx-2 sm:mx-auto max-w-md"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-12">
        {Object.values(PREMIUM_TIERS).map((plan) => (
          <PremiumPlanCard
            key={plan}
            plan={plan}
            isActive={selectedPlan === plan}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-white text-sm sm:text-lg
            ${selectedPlan === PREMIUM_TIERS.FREE ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}
            transition-all duration-200 shadow-lg`}
          onClick={handleSubscribe}
          disabled={selectedPlan === PREMIUM_TIERS.FREE || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Subscribe to ${getPlanName(selectedPlan)}`
          )}
        </motion.button>
      </div>

      <div className="mt-8 sm:mt-16 bg-gray-100 rounded-lg p-3 sm:p-6 max-w-2xl mx-auto">
        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Subscription FAQs</h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="font-semibold text-base sm:text-lg">How do subscriptions work?</h4>
            <p className="text-gray-600 text-sm sm:text-base">Subscriptions are billed monthly and give you access to premium celestial bodies and features in our app.</p>
          </div>
          <div>
            <h4 className="font-semibold text-base sm:text-lg">Can I cancel anytime?</h4>
            <p className="text-gray-600 text-sm sm:text-base">Yes, you can cancel your subscription anytime and continue using premium features until the end of your billing period.</p>
          </div>
          <div>
            <h4 className="font-semibold text-base sm:text-lg">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm sm:text-base">We accept all major credit cards and PayPal for subscription payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
