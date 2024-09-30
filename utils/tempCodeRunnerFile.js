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
      // Return an array of matching cities
      return matchingCities.map(city => ({
        name: city.name,
        country: city.country,
        latitude: city.loc.coordinates[1],
        longitude: city.loc.coordinates[0]
      }));
    } else {
      console.log(`No cities found with the name "${cityName}"`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    throw new Error('An error occurred while fetching city data.');
  }
};

// Example Usage
const cityName = 'Delhi';
const citiesWithSameName = getCitiesByName(cityName);

if (citiesWithSameName.length > 0) {
  console.log(`Cities with the name "${cityName}":`);
  citiesWithSameName.forEach(city => {
    console.log(`City: ${city.name}, Country: ${city.country}, Latitude: ${city.latitude}, Longitude: ${city.longitude}`);
  });
} else {
  console.log(`No cities found with the name "${cityName}"`);
}
