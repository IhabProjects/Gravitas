const calculatePlanetWeight = (req, res) => {
  const { weight, planet } = req.body; // Destructure the request body

  if (!weight || !planet) {
    return res.status(400).json({ error: "Weight and planet are required." });
  }

  const planetGravities = {
    mercury: 0.378,
    venus: 0.907,
    mars: 0.377,
    jupiter: 2.364,
    saturn: 0.916,
    uranus: 0.889,
    neptune: 1.12,
  };

  const planetWeights = Object.entries(planetGravities).map(
    ([planet, gravity]) => {
      planet, (weight = (earthWeight * gravity).toFixed(2));
    }
  );
  res.json(planetWeights);
};

module.exports = {
  calculatePlanetWeight,
};
