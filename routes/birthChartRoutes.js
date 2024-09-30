const express = require('express');
const router = express.Router();
const birthChartController = require('../controllers/birthChartController');
const cityController = require('../controllers/cityController');
const planetDetailsController = require('../controllers/planetDetailsController');

const getashtakvargaController = require('../controllers/ashtakvargaController');
// Route to fetch matching cities
router.get('/locations', cityController.fetchCities);

// Route to generate and fetch the birth chart
router.get('/birthchart', birthChartController.createBirthChart);

router.get('/planetDetails', planetDetailsController.getPlanetDetails);

router.get('/ashtakvarga', getashtakvargaController.getashtakvarga);
module.exports = router;
