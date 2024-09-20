const { insertEvent, insertSubsection, getAllEvents, getEventById } = require('../models/eventModel');
const path = require('path');

const createEvent = async (req, res) => {
    const { title, description, event_date, subsections } = req.body;

    let parsedSubsections;
    if (typeof subsections === 'string') {
        try {
            parsedSubsections = JSON.parse(subsections);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid subsections format' });
        }
    } else {
        parsedSubsections = subsections;
    }

    const sectionImages = req.files['sectionImages'] || [];
    const sectionImageUrls = sectionImages.map(file => `http://localhost:${process.env.PORT || 3001}/uploads/${file.filename}`);

    try {
        const sectionId = await insertEvent(title, description, sectionImageUrls.join(','), event_date);

        if (Array.isArray(parsedSubsections) && parsedSubsections.length > 0) {
            for (const subsection of parsedSubsections) {
                const subsectionImages = req.files['subsectionImages'] || [];
                const subsectionImageUrls = subsectionImages.map(file => `http://localhost:${process.env.PORT || 3001}/uploads/${file.filename}`);

                await insertSubsection(
                    sectionId,
                    subsection.title,
                    subsection.description,
                    subsectionImageUrls.join(','),
                    subsection.date
                );
            }
        }

        res.status(201).json({ message: 'Event created successfully!', id: sectionId });
    } catch (error) {
        console.error('Error inserting event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchAllEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createEvent,
    fetchAllEvents,
    fetchEventById,
};
