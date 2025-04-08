// backend/controllers/planetWeightController.js
const calculatePlanetWeight = (req, res) => {
    try {
      // Log the incoming request body for debugging
      console.log('Received request body:', req.body);

      // Ensure earthWeight is parsed as a number
      const earthWeight = parseFloat(req.body.earthWeight);

      // Validate input
      if (!earthWeight || isNaN(earthWeight)) {
        console.error('Invalid weight input:', req.body.earthWeight);
        return res.status(400).json({
          error: 'Invalid weight input',
          receivedValue: req.body.earthWeight
        });
      }

      // Planet gravity relative to Earth
      const planetGravities = {
        Mercury: 0.38,
        Venus: 0.91,
        Mars: 0.38,
        Jupiter: 2.34,
        Saturn: 1.06,
        Uranus: 0.92,
        Neptune: 1.19,
        Pluto: 0.06
      };

      const planetWeights = Object.entries(planetGravities).map(([planet, gravity]) => ({
        planet,
        weight: (earthWeight * gravity).toFixed(2)
      }));

      // Log the calculated weights
      console.log('Calculated planet weights:', planetWeights);

      res.status(200).json(planetWeights);
    } catch (error) {
      console.error('Weight calculation error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  };

  module.exports = { calculatePlanetWeight };
