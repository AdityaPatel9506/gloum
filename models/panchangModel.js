const axios = require('axios');
const cities = require('all-the-cities');
const geoTz = require('geo-tz');
const moment = require('moment-timezone');
require('dotenv').config();

// Function to get the latitude and longitude of a city using `all-the-cities`
const getCoordinates = async (cityName) => {
  console.log("Location data called");

  try {
    // Find the city in the `all-the-cities` data
    const city = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

    if (city) {
      console.log("Location data fetched");
      const { coordinates } = city.loc;
      const [longitude, latitude] = coordinates;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      return { latitude, longitude };
    } else {
      console.log("City not found");
      throw new Error('City not found. Please verify the city name.');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw new Error('Please enter the official name of your city.');
  }
};

// Function to convert timezone offset in `+HH:MM` format to decimal format
const convertToDecimal = (offset) => {
  // offset is in the format of `+HH:MM`
  const [sign, time] = offset.split(/([+-])/).filter(Boolean);
  const [hours, minutes] = time.split(':').map(Number);
  const decimalOffset = hours + minutes / 60;
  return sign === '-' ? -decimalOffset : decimalOffset;
};

// Function to get the timezone based on latitude and longitude using `geo-tz`
const getTimezoneFromCoords = (latitude, longitude) => {
  try {
    // `geoTz.find` returns an array of timezones, so we take the first one
    const timezones = geoTz.find(latitude, longitude);
    if (timezones && timezones.length > 0) {
      const timezone = timezones[0];
      console.log(`Timezone: ${timezone}`);

      // Get the numerical offset from the timezone name
      const offset = moment.tz(timezone).format('Z');
      console.log(`Offset: ${offset}`);

      // Convert the timezone offset to decimal format
      const decimalOffset = convertToDecimal(offset);
      console.log(`Decimal Offset: ${decimalOffset}`);
      return decimalOffset;
    } else {
      throw new Error('Timezone data not found.');
    }
  } catch (error) {
    console.error('Error fetching timezone:', error.message);
    throw new Error('Error fetching timezone data.');
  }
};

// Function to get Panchang details using the provided parameters
const getPanchangDetails = async (date, time, cityName) => {
  console.log("Panchang data called");
  try {
    // Get the coordinates of the city
    const coordinates = await getCoordinates(cityName);
    const { latitude, longitude } = coordinates;

    // Get the timezone offset based on coordinates
    const timezoneOffset = getTimezoneFromCoords(latitude, longitude);
    
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    console.log(`Timezone Offset: ${timezoneOffset}`);
    
    // Call the Panchang API with the obtained coordinates and timezone offset
    const response = await axios.get('https://api.vedicastroapi.com/v3-json/panchang/panchang', {
      params: {
        api_key: process.env.API_KEY, // Replace with your actual API key
        date: date,
        lat:  28.7041,
        lon: 77.1025,
        tz: timezoneOffset, // Use the obtained timezone offset
        lang: 'en',
      },
    });

    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching Panchang data:', error.message);
    let errorMessage = 'Error fetching Panchang data.';

    // Handle specific errors and set the appropriate message
    if (error.message.includes('City not found')) {
      errorMessage = 'City not found. Please verify the city name.';
    } else if (error.message.includes('timezone')) {
      errorMessage = 'Error determining the timezone. Please check the coordinates.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

module.exports = {
  getCoordinates,
  getPanchangDetails,
};
