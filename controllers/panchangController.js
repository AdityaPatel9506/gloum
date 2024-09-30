// panchangController.js
const panchangModel = require('../models/panchangModel');
require('dotenv').config();

const fetchPanchang = async (req, res) => {
  const date = req.query.date || req.body.date;
  const time = req.query.time || req.body.time;
  const cityName = req.query.cityName || req.body.cityName;

  console.log(`Date: ${date}, Time: ${time}, City: ${cityName}`);

  try {
      const panchangData = await panchangModel.getPanchangDetails(date, time, cityName);
      res.json(panchangData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
  
  module.exports = {
    fetchPanchang,
  };