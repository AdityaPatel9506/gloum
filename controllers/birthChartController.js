const { getTimezoneFromCoords } = require('../utils/locationUtils');
const axios = require('axios');
require('dotenv').config();

// Function to format the date as DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to generate the birth chart
const generateBirthChart = async (lat, lon, dob, tob, api_key) => {
  try {
    console.log("Starting birth chart generation...");
    console.log(`Parameters - Latitude: ${lat}, Longitude: ${lon}, DOB: ${dob}, TOB: ${tob}`);

    // Fetch the timezone based on coordinates
    const timezone = await getTimezoneFromCoords(lat, lon);
    console.log(`Timezone obtained: ${timezone}`);

    // Format the date of birth
    const formattedDob = formatDate(dob);
    console.log(`Formatted Date of Birth: ${formattedDob}`);

    const params = {
      dob: formattedDob, // Use formatted date
      tob: tob,
      lat: lat,
      lon: lon,
      tz: timezone, // Use timezone obtained from coordinates
      div: 'D1',
      color: '%23ff3366',
      style: 'north',
      api_key: api_key,
      lang: 'en',
      font_size: 12,
      font_style: 'roboto',
      colorful_planets: 0,
      size: 300,
      stroke: 2,
      format: 'base64'
    };

    // Construct the final URL
    const baseUrl = 'https://api.vedicastroapi.com/v3-json/horoscope/chart-image';
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;
    console.log('Constructed URL:', url);

    // Make the API request
    const response = await axios.get(url);
    console.log('API response received successfully');

    // Log response data for debugging
    console.log('Response Data:', response.data);

    // Return the response data (assumed to be XML)
    return response.data;
  } catch (error) {
    console.error('Error generating birth chart:', error.message);
    throw new Error('Error generating birth chart.');
  }
};

// Controller function to create a new birth chart entry
const createBirthChart = async (req, res) => {
  try {
    console.log('Received request to create a birth chart entry...');
    
    const { dob, tob, lat, lon } = req.query; // Use req.query for GET request
    console.log(`Request parameters - dob: ${dob}, tob: ${tob}, lat: ${lat}, lon: ${lon}`);

    // Validate the input
    if (!dob || !tob || !lat || !lon) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: dob, tob, lat, or lon.' });
    }

    // API key from environment variables
    const api_key = process.env.API_KEY;
    if (!api_key) {
      console.error('API key not found in environment variables.');
      return res.status(500).json({ error: 'API key not found in environment variables.' });
    }

    // Generate the birth chart
    const xmlResponse = await generateBirthChart(lat, lon, dob, tob, api_key);
    console.log('Birth chart generated successfully.');

    // Send XML response
    res.set('Content-Type', 'application/xml');
    res.send(xmlResponse);
  } catch (error) {
    console.error('Error creating birth chart:', error.message);
    res.status(500).json({ error: 'Error generating birth chart.' });
  }
};

module.exports = {
  createBirthChart
};
