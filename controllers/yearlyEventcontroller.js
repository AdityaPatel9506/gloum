const { 
    insertEvent, 
    insertSubsection, 
    getAllEvents, 
    getEventById, 
    deleteSubsectionsBySectionId, 
    deleteEventFromDB 
} = require('../models/yearlyModel');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const createEvent = async (req, res) => {
    const { title, description, event_date, subsections } = req.body;

    // Parse subsections if it's a string
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

    // Store section images URLs
    const sectionImages = req.files['sectionImages'] || [];
    const sectionImageUrls = sectionImages.map(file => `http://localhost:${process.env.PORT || 3001}/uploads/${file.filename}`);

    try {
        // Insert the main event section
        const sectionId = await insertEvent(title, description, sectionImageUrls.join(','), event_date);

        // Check if subsections exist and are valid
        if (Array.isArray(parsedSubsections) && parsedSubsections.length > 0) {
            const subsectionImages = req.files['subsectionImages'] || [];

            // Ensure subsectionImages match the number of subsections
            if (subsectionImages.length !== parsedSubsections.length) {
                return res.status(400).json({ error: 'Mismatch between subsections and subsection images.' });
            }

            // Insert each subsection with its corresponding image
            for (let i = 0; i < parsedSubsections.length; i++) {
                const subsection = parsedSubsections[i];
                const subsectionImageUrl = `http://localhost:${process.env.PORT || 3001}/uploads/${subsectionImages[i].filename}`;

                await insertSubsection(
                    sectionId,
                    subsection.title,
                    subsection.description,
                    subsectionImageUrl,  // Assign the correct image for each subsection
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

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete images from the file system
        const sectionImageUrls = event.image_url.split(',');
        sectionImageUrls.forEach(imageUrl => {
            const imagePath = path.join(__dirname, '../uploads/', path.basename(imageUrl));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        // Delete associated subsections
        await deleteSubsectionsBySectionId(id);

        // Delete the event from the database
        await deleteEventFromDB(id);
        
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, event_date, subsections } = req.body;

    // Parse subsections if it's a string
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

    try {
        // Fetch the current event data
        const [currentEvent] = await db.query('SELECT * FROM yearly_events WHERE id = ?', [id]);
        if (!currentEvent.length) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Handle section images
        const sectionImages = req.files['sectionImages'] || [];
        let sectionImageUrls = currentEvent[0].image_url.split(','); // Keep existing images

        if (sectionImages.length > 0) {
            // Delete old section images if needed
            for (const imageUrl of sectionImageUrls) {
                if (imageUrl) {
                    const filename = path.basename(imageUrl);
                    const filePath = path.join(__dirname, '../uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Synchronously delete old images
                    }
                }
            }

            // Update with new image URLs
            sectionImageUrls = sectionImages.map(file => `http://localhost:${process.env.PORT || 3001}/uploads/${file.filename}`);
        }

        // Update the main event section
        await db.query(
            'UPDATE yearly_events SET title = ?, description = ?, image_url = ?, event_date = ? WHERE id = ?',
            [title, description, sectionImageUrls.join(','), event_date, id]
        );

        // Handle subsections
        const [existingSubsections] = await db.query('SELECT * FROM yearly_event_subsections WHERE section_id = ?', [id]);
        console.log('Existing Subsections:', existingSubsections);

        if (Array.isArray(parsedSubsections) && parsedSubsections.length > 0) {
            for (let i = 0; i < parsedSubsections.length; i++) {
                const subsection = parsedSubsections[i];
                const subsectionImageUrl = req.files['subsectionImages'] && req.files['subsectionImages'][i]
                    ? `http://localhost:${process.env.PORT || 3001}/uploads/${req.files['subsectionImages'][i].filename}`
                    : null;

                const existingSubsection = existingSubsections.find(sub => sub.id === subsection.id);

                if (existingSubsection) {
                    // Delete old subsection image if necessary
                    if (subsectionImageUrl && existingSubsection.image_url) {
                        const oldImagePath = path.join(__dirname, '../uploads', path.basename(existingSubsection.image_url));
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath); // Delete old image
                        }
                    }

                    // Update existing subsection
                    await db.query(
                        'UPDATE yearly_event_subsections SET title = ?, description = ?, image_url = ?, date = ? WHERE id = ?',
                        [subsection.title, subsection.description, subsectionImageUrl, subsection.date, subsection.id]
                    );
                } else {
                    // Insert new subsection
                    await insertSubsection(
                        id,
                        subsection.title,
                        subsection.description,
                        subsectionImageUrl,
                        subsection.date
                    );
                }
            }

            // Optionally delete old subsections not present in parsedSubsections
            const parsedSubsectionIds = parsedSubsections.map(sub => sub.id);
            const subsectionsToDelete = existingSubsections.filter(sub => !parsedSubsectionIds.includes(sub.id));

            for (const sub of subsectionsToDelete) {
                await db.query('DELETE FROM yearly_event_subsections WHERE id = ?', [sub.id]);
            }
        }

        res.status(200).json({ message: 'Event updated successfully!' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createEvent,
    fetchAllEvents,
    fetchEventById,
    deleteEvent,
    updateEvent
};
