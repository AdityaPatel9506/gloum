const { nakshatraModel } = require('../models/nakshtraModel');

// Controller function to handle the API call
const getNakshatraMatching = async (req, res) => {
  try {
    const params = {
      boy_star: req.body.boy_star || req.query.boy_star,
      girl_star: req.body.girl_star || req.query.girl_star,
      lang: req.body.lang || req.query.lang || 'en',
      api_key: process.env.API_KEY || req.body.api_key || req.query.api_key
    };

    console.log("Request Body: ", req.body);
    console.log("Request Query: ", req.query);

    // Call the model to fetch data
    const data = await nakshatraModel(params);
    
    // Return the data as a response
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNakshatraMatching
};
