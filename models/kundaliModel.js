// models/kundaliModel.js
const axios = require('axios');
const { getCoordinates, getTimezoneFromCoords } = require('../utils/locationUtils');
const { formatDate } = require('../utils/dateUtils');

// Function to get matching data from the external API
const getMatchingData = async (params) => {
  try {
    // Format dates
    params.boy_dob = formatDate(params.boy_dob);
    params.girl_dob = formatDate(params.girl_dob);

    // Fetch coordinates and timezone if the city name is provided
    if (params.boy_pob) {
      const { latitude, longitude } = await getCoordinates(params.boy_pob);
      params.boy_lat = latitude;
      params.boy_lon = longitude;
      params.boy_tz = await getTimezoneFromCoords(latitude, longitude);
    }

    if (params.girl_pob) {
      const { latitude, longitude } = await getCoordinates(params.girl_pob);
      params.girl_lat = latitude;
      params.girl_lon = longitude;
      params.girl_tz = await getTimezoneFromCoords(latitude, longitude);
    }

    // Make API request
    const response = await axios.get('https://api.vedicastroapi.com/v3-json/matching/ashtakoot-with-astro-details', {
  
    params: {
        boy_dob: params.boy_dob,
        boy_tob: params.boy_tob,
        boy_tz: params.boy_tz,
        boy_lat: params.boy_lat,
        boy_lon: params.boy_lon,
        girl_dob: params.girl_dob,
        girl_tob: params.girl_tob,
        girl_tz: params.girl_tz,
        girl_lat: params.girl_lat,
        girl_lon: params.girl_lon,
        lang: params.lang,
        api_key: params.api_key
      }
    });
    console.log(response); 
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch matching data: ${error.message}`);
  }
};

module.exports = {
  getMatchingData
};
