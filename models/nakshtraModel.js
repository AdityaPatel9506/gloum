const axios = require('axios');

// Function to get Nakshatra matching data from the external API
const nakshatraModel = async (params) => {
  try {
    // Make the API request
    const response = await axios.get('https://api.vedicastroapi.com/v3-json/matching/nakshatra-match', {
      params: {
        boy_star: params.boy_star,
        girl_star: params.girl_star,
        api_key: params.api_key,
        lang: params.lang
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch Nakshatra matching data: ${error.message}`);
  }
};

module.exports = {
  nakshatraModel
};
