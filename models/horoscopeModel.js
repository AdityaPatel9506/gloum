const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../config/db'); // Import the database connection

// Utility function to clean HTML content
function cleanHtmlContent(htmlContent) {
    const $ = cheerio.load(htmlContent);
    $('a, img, script, style').remove(); // Remove unwanted tags
    $('p:has(a)').remove(); // Remove paragraphs containing links
    return $.html();
}

// Function to fetch horoscope from the database
async function getHoroscopeFromDB(zodiacSign, type, year = null, month = null, day = null) {
    try {
        let query = 'SELECT content, created_at FROM horoscopes WHERE zodiac_sign = ? AND type = ?';
        const params = [zodiacSign, type];

        if (year) {
            query += ' AND year = ?';
            params.push(year);
        } else {
            query += ' AND year IS NULL';
        }

        if (month) {
            query += ' AND month = ?';
            params.push(month);
        } else {
            query += ' AND month IS NULL';
        }

        if (day) {
            query += ' AND day = ?';
            params.push(day);
        } else {
            query += ' AND day IS NULL';
        }

        const [rows] = await db.query(query, params);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching horoscope from database:', error);
        return null;
    }
}

// Function to store or update horoscope in the database
async function storeOrUpdateHoroscopeInDB(zodiacSign, type, year = null, month = null, day = null, content) {
    try {
        const query = `
            INSERT INTO horoscopes (zodiac_sign, type, year, month, day, content, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                content = CASE 
                            WHEN VALUES(created_at) > created_at THEN VALUES(content) 
                            ELSE content 
                          END, 
                created_at = CASE 
                              WHEN VALUES(created_at) > created_at THEN VALUES(created_at) 
                              ELSE created_at 
                            END
        `;
        await db.query(query, [zodiacSign, type, year, month, day, content]);
    } catch (error) {
        console.error('Error storing/updating horoscope in database:', error);
        throw error;
    }
}

// General function to fetch horoscope data from the web
async function fetchHoroscopeFromWeb(url, containerSelector) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const contentHtml = $(containerSelector).html();
        const cleanedContent = cleanHtmlContent(contentHtml);

        return cleanedContent;
    } catch (error) {
        console.error(`Error fetching horoscope from ${url}:`, error);
        return null;
    }
}

// Function to check if the horoscope data is outdated
function isOutdated(type, createdAt) {
    const now = new Date();
    const lastUpdateDate = new Date(createdAt);

    switch (type) {
        case 'daily':
            return now.getDate() !== lastUpdateDate.getDate() ||
                   now.getMonth() !== lastUpdateDate.getMonth() ||
                   now.getFullYear() !== lastUpdateDate.getFullYear();
        case 'monthly':
            return now.getMonth() !== lastUpdateDate.getMonth() ||
                   now.getFullYear() !== lastUpdateDate.getFullYear();
        case 'yearly':
            return now.getFullYear() !== lastUpdateDate.getFullYear();
        default:
            return false;
    }
}

// Function to fetch and return the horoscope data
async function getHoroscope(type, zodiacSign, year = new Date().getFullYear()) {
    const month = new Date().getMonth() + 1; // Current month (1-12)
    const day = new Date().getDate(); // Current day (1-31)

    try {
        // Check if the horoscope is already in the database
        const existingRecord = await getHoroscopeFromDB(zodiacSign, type, year, type === 'monthly' ? month : null, type === 'daily' ? day : null);
        if (existingRecord && !isOutdated(type, existingRecord.created_at)) {
            return existingRecord.content;
        }

        // Define the URLs and selectors based on the horoscope type
        const urlMap = {
            'daily': `https://www.astrosage.com/horoscope/daily-${zodiacSign}-horoscope.asp`,
            'weekly': `https://www.astrosage.com/horoscope/weekly-${zodiacSign}-horoscope.asp`,
            'monthly': `https://www.astrosage.com/horoscope/monthly-${zodiacSign}-horoscope.asp`,
            'yearly': `https://www.astrosage.com/${year}/${zodiacSign}-horoscope-${year}.asp`
        };

        const selectorMap = {
            'daily': '.ui-large-content.text-justify',
            'weekly': '.ui-sign-content-box .content',
            'monthly': '.ui-sign-content-box',
            'yearly': '.ui-content.bg-light-gray'
        };

        const url = urlMap[type];
        const selector = selectorMap[type];

        // Fetch the horoscope from the web
        const content = await fetchHoroscopeFromWeb(url, selector);

        if (content) {
            // Store the fetched horoscope in the database
            await storeOrUpdateHoroscopeInDB(zodiacSign, type, year, type === 'monthly' ? month : null, type === 'daily' ? day : null, content);
        }

        return content;
    } catch (error) {
        console.error('Failed to fetch horoscope:', error);
        return null;
    }
}

module.exports = {
    getHoroscope,
};
