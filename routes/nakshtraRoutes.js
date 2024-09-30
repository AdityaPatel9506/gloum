// routes/nakshatraRouter.js
const express = require('express');
const router = express.Router();
const nakshatraController = require('../controllers/nakshtraController');

// Define the route for Nakshatra matching
router.get('/matching', nakshatraController.getNakshatraMatching);

module.exports = router;
