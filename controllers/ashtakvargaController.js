const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env
const { formatDate } = require('../utils/dateUtils'); // Import the formatDate function
const { getTimezoneFromCoords } = require('../utils/locationUtils'); // Import location utilities

// Controller function to get planet details
const getashtakvarga = async (req, res) => {
  const { dob, tob, lat, lon } = req.query;

  // Log the parameters to the console
  console.log('Received parameters:', { dob, tob, lat, lon });

  // Get the API key from the environment variables
  const api_key = process.env.API_KEY;

  // Validate that all required parameters are present
  if (!dob || !tob || !lat || !lon || !api_key) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  // Format the date of birth
  const formattedDob = formatDate(dob);

  try {
    // Get timezone from coordinates
    const tz = await getTimezoneFromCoords(parseFloat(lat), parseFloat(lon));

    // Construct the API endpoint URL
    const apiUrl = 'https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga'; // Replace with the actual API endpoint

    

    // Make the API request with the provided parameters
    const response = await axios.get(apiUrl, {
      params: {
        dob: formattedDob,
        tob,
        lat,
        lon,
        tz,
        api_key,
        lang: 'en', // Fixed value for lang
      },
    });
    console.log(response);
    // Send the API response back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching planet details:', error.message);
    res.status(500).json({ error: 'Failed to fetch planet details' });
  }
};

module.exports = {
    getashtakvarga
};
