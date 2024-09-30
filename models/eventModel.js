const db = require('../config/db'); // Adjust the path if needed

const insertEvent = async (title, description, imageUrl, eventDate) => {
    const [result] = await db.query(
        'INSERT INTO sections (title, description, image_url, event_date) VALUES (?, ?, ?, ?)',
        [title, description, imageUrl, eventDate]
    );
    return result.insertId;
};

const insertSubsection = async (sectionId, title, description, imageUrl, date) => {
    const [result] = await db.query(
        'INSERT INTO subsections (section_id, title, description, image_url, date) VALUES (?, ?, ?, ?, ?)',
        [sectionId, title, description, imageUrl, date]
    );
    return result.insertId;
};

const getAllEvents = async () => {
    const [rows] = await db.query('SELECT * FROM sections');
    return rows;
};

const getEventById = async (id) => {
    try {
        // Fetch event details
        const [eventRows] = await db.query('SELECT * FROM sections WHERE id = ?', [id]);

        if (eventRows.length === 0) {
            return null; // No event found
        }

        const event = eventRows[0];

        // Fetch subsections related to the event
        const [subsectionRows] = await db.query('SELECT * FROM subsections WHERE section_id = ?', [id]);
        // console.log('Query:', 'SELECT * FROM subsections WHERE section_id = ?', [id]);

        // Combine event and subsections
        // console.log(subsectionRows);
        
        return {
            ...event,
            subsections: subsectionRows
        };

    } catch (error) {
        console.error('Error fetching event details:', error);
        throw new Error('Internal Server Error');
    }
};
const deleteEventFromDB = async (id) => {
    await db.query('DELETE FROM sections WHERE id = ?', [id]);
};

const deleteSubsectionsBySectionId = async (sectionId) => {
    await db.query('DELETE FROM subsections WHERE section_id = ?', [sectionId]);
};

module.exports = {
    insertEvent,
    insertSubsection,
    getAllEvents,
    getEventById,
    deleteEventFromDB,
    deleteSubsectionsBySectionId,
};
