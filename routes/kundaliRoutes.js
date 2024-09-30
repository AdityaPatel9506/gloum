// routes/matchingRoutes.js
const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/kundaliController');

// Define a route for matching data
router.get('/matching', matchingController.getMatching);

module.exports = router;
