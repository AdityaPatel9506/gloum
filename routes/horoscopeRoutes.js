// routes/horoscopeRoutes.js
const express = require('express');
const { 
  getDailyHoroscope, 
  getMonthlyHoroscope, 
  getWeeklyHoroscope, 
  getYearlyHoroscope 
} = require('../controllers/horoscopeController');

const router = express.Router();

// Route to fetch daily horoscope
// Example URL: /horoscope/daily/aries
router.get('/daily/:zodiacSign', getDailyHoroscope);

// Route to fetch monthly horoscope
// Example URL: /horoscope/monthly/aries
router.get('/monthly/:zodiacSign', getMonthlyHoroscope);

// Route to fetch weekly horoscope
// Example URL: /horoscope/weekly/aries
router.get('/weekly/:zodiacSign', getWeeklyHoroscope);

// Route to fetch yearly horoscope
// Example URL: /horoscope/yearly/aries?year=2024
router.get('/yearly/:zodiacSign', getYearlyHoroscope);

module.exports = router;
