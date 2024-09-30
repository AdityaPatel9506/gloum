const { getHoroscope } = require('../models/horoscopeModel');

// Fetch daily horoscope
async function getDailyHoroscope(req, res) {
    const { zodiacSign } = req.params;

    try {
        const horoscopeHtml = await getHoroscope('daily', zodiacSign);
        res.send(horoscopeHtml);
    } catch (error) {
        res.status(500).send('Failed to fetch daily horoscope');
    }
}

// Fetch monthly horoscope
async function getMonthlyHoroscope(req, res) {
    const { zodiacSign } = req.params;

    try {
        const horoscopeHtml = await getHoroscope('monthly', zodiacSign);
        res.send(horoscopeHtml);
    } catch (error) {
        res.status(500).send('Failed to fetch monthly horoscope');
    }
}

// Fetch weekly horoscope
async function getWeeklyHoroscope(req, res) {
    const { zodiacSign } = req.params;

    try {
        const horoscopeHtml = await getHoroscope('weekly', zodiacSign);
        res.send(horoscopeHtml);
    } catch (error) {
        res.status(500).send('Failed to fetch weekly horoscope');
    }
}

// Fetch yearly horoscope
async function getYearlyHoroscope(req, res) {
    const { zodiacSign } = req.params;
    const year = req.query.year || new Date().getFullYear();

    try {
        const horoscopeHtml = await getHoroscope('yearly', zodiacSign, year);
        res.send(horoscopeHtml);
    } catch (error) {
        res.status(500).send('Failed to fetch yearly horoscope');
    }
}

module.exports = {
    getDailyHoroscope,
    getMonthlyHoroscope,
    getWeeklyHoroscope,
    getYearlyHoroscope
};
