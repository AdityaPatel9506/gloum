const { getCitiesByName } = require('../utils/cityUtils');

const fetchCities = (req, res) => {
    console.log("fetch city called");
  const cityName = req.query.cityName;
    console.log(cityName);
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const citiesWithSameName = getCitiesByName(cityName);
    res.json(citiesWithSameName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchCities };
