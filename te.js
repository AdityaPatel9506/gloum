const Astronomical = require('astronomy-engine');

// Example: Calculate sunrise and sunset
const { getSunrise, getSunset } = Astronomical;
const date = new Date();
const latitude = 17.38333;
const longitude = 78.4666;

console.log('Sunrise:', getSunrise(date, latitude, longitude));
console.log('Sunset:', getSunset(date, latitude, longitude));
