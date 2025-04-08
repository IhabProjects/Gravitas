// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Calculates weight on different planets
 * @param {number} earthWeight - Weight on Earth in kg
 * @returns {Promise<Array>} - Array of planet weights
 */
export const calculatePlanetWeights = async (earthWeight) => {
  try {
    const response = await fetch(`${API_URL}/api/planet-weight/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ earthWeight }),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate planet weights');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calculating planet weights:', error);
    return null;
  }
};

export default {
  calculatePlanetWeights,
  API_URL
};
