const express = require("express");
const {
  calculatePlanetWeight,
} = require("../controllers/planetWeightController");

const router = express.Router();

// Use router.route for chaining HTTP methods
router.route("/calculate").post(calculatePlanetWeight);

module.exports = router;
