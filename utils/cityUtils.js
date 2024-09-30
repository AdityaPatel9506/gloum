const cities = require('all-the-cities');

// Function to get all cities with a name similar to the one passed
const getCitiesByName = (cityName) => {
  console.log("Fetching cities with a similar name");

  try {
    // Filter the cities that match the given city name
    const matchingCities = cities.filter(city =>
      city.name.toLowerCase() === cityName.toLowerCase()
    );

    if (matchingCities.length > 0) {
      console.log(`${matchingCities.length} cities found with the name "${cityName}"`);
      
      // Create an object where city names are keys and an array of details is the value
      const result = {};

      matchingCities.forEach(city => {
        if (!result[city.name]) {
          // Initialize an array for the city name if it doesn't exist
          result[city.name] = [];
        }

        // Push the city details into the array
        result[city.name].push({
          country: city.country,
          latitude: city.loc.coordinates[1],
          longitude: city.loc.coordinates[0]
        });
      });

      return result; // Return the result object
    } else {
      console.log(`No cities found with the name "${cityName}"`);
      return {}; // Return an empty object if no cities found
    }
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    throw new Error('An error occurred while fetching city data.');
  }
};

module.exports = { getCitiesByName };
