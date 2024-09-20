const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch and process horoscope data
async function fetchHoroscope(year, zodiacSign) {
  try {
    // Construct the URL based on year and zodiac sign
    const url = `https://www.astrosage.com/${year}/${zodiacSign}-horoscope-${year}.asp`;
    
    // Fetch the HTML content
    const { data } = await axios.get(url);
    
    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    
    // Find all divs with class 'ui-content bg-light-gray'
    const divs = $('.ui-content.bg-light-gray');

    // Remove the last <div> with the class 'card-view-content'
    divs.find('div.card-view-content').last().remove();
    
    // Initialize an array to store the processed HTML
    let processedHtml = '';

    // Iterate over each remaining div
    divs.each((index, element) => {
      const divContent = $(element);

      // Remove all <p> tags that contain an <a> tag
      divContent.find('p:has(a)').remove();

      // Remove all <a> and <img> tags while keeping their content
      divContent.find('a, img').remove();

      // Append the processed div HTML to the result
      processedHtml += divContent.html();
    });

    // Wrap the processed HTML inside a div with id 'horoscope-content'
    const finalHtml = `<div id="horoscope-content">\n${processedHtml}\n</div>`;

    // Return the processed HTML
    return finalHtml;
  } catch (error) {
    console.error('Error fetching horoscope data:', error);
    throw error; // Rethrow error to be handled by the caller
  }
}

// Example usage with async/await
async function displayHoroscope(year, zodiacSign) {
  try {
    const html = await fetchHoroscope(year, zodiacSign);
    console.log(`Horoscope for ${zodiacSign} in ${year}:`, html);
  } catch (error) {
    console.error('Failed to fetch horoscope:', error);
  }
}

// Call the async function with the desired year and zodiac sign
displayHoroscope(2024, 'aries');
