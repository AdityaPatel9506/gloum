// routes/panchangRoutes.js

const express = require('express');
const router = express.Router();
const panchangController = require('../controllers/panchangController');

// Route to get Panchang data for a specific date
router.get('/panchang', panchangController.fetchPanchang);

module.exports = router;
