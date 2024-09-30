const db = require('../config/db'); // Adjust the path if needed

const insertEvent = async (title, description, imageUrl, eventDate) => {
    const [result] = await db.query(
        'INSERT INTO yearly_events (title, description, image_url, event_date) VALUES (?, ?, ?, ?)',
        [title, description, imageUrl, eventDate]
    );
    return result.insertId;
};

const insertSubsection = async (sectionId, title, description, imageUrl, date) => {
    const [result] = await db.query(
        'INSERT INTO yearly_event_subsections (section_id, title, description, image_url, date) VALUES (?, ?, ?, ?, ?)',
        [sectionId, title, description, imageUrl, date]
    );
    return result.insertId;
};

const getAllEvents = async () => {
    const [rows] = await db.query('SELECT * FROM yearly_events');
    return rows;
};

const getEventById = async (id) => {
    try {
        // Fetch event details
        const [eventRows] = await db.query('SELECT * FROM yearly_events WHERE id = ?', [id]);

        if (eventRows.length === 0) {
            return null; // No event found
        }

        const event = eventRows[0];

        // Fetch subsections related to the event
        const [subsectionRows] = await db.query('SELECT * FROM yearly_event_subsections WHERE section_id = ?', [id]);

        // Combine event and subsections
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
    await db.query('DELETE FROM yearly_events WHERE id = ?', [id]);
};

const deleteSubsectionsBySectionId = async (sectionId) => {
    await db.query('DELETE FROM yearly_event_subsections WHERE section_id = ?', [sectionId]);
};

module.exports = {
    insertEvent,
    insertSubsection,
    getAllEvents,
    getEventById,
    deleteEventFromDB,
    deleteSubsectionsBySectionId,
};
