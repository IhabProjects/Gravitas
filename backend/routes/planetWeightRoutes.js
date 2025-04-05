const express = require('express');

const { calculateWeight } = require('../controllers/planetWeightController');
const router = express.Router();

router.post('/calculate', calculateWeight);

module.exports = router;
// This code defines a route for calculating weight on different planets. It imports the necessary modules, creates a router, and defines a POST route that calls the `calculateWeight` function from the controller when a request is made to `/calculate`. Finally, it exports the router for use in other parts of the application.
