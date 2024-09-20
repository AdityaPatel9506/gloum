const matchingModel = require('../models/kundaliModel');
require('dotenv').config();

const getMatching = async (req, res) => {
  try {
    const params = {
      boy_dob: req.body.boy_dob || req.query.boy_dob,
      boy_tob: req.body.boy_tob || req.query.boy_tob,
      boy_pob: req.body.boy_pob || req.query.boy_pob,
      girl_dob: req.body.girl_dob || req.query.girl_dob,
      girl_tob: req.body.girl_tob || req.query.girl_tob,
      girl_pob: req.body.girl_pob || req.query.girl_pob,
      lang: req.body.lang || req.query.lang,
      api_key: process.env.API_KEY // API key from environment variable
    };

    const data = await matchingModel.getMatchingData(params);
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMatching
};
