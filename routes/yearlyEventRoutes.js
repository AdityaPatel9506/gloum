const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createEvent,
    fetchAllEvents,
    fetchEventById,
    deleteEvent,
    updateEvent
} = require('../controllers/yearlyEventcontroller'); // Import methods from the controller

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Log incoming request body and file details
        console.log(req.body);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure Multer upload settings
const upload = multer({ storage }).fields([
    { name: 'sectionImages', maxCount: 5 },
    { name: 'subsectionImages', maxCount: 5 }
]);

// Routes

// Create a new event
router.post('/events', upload, (req, res, next) => {
    // Log uploaded file names
    if (req.files) {
        if (req.files.sectionImages) {
            req.files.sectionImages.forEach(file => {
                console.log('Section Image:', file.originalname);
            });
        }
        
        if (req.files.subsectionImages) {
            req.files.subsectionImages.forEach(file => {
                console.log('Subsection Image:', file.originalname);
            });
        }
    } else {
        console.log('No files uploaded.');
    }

    // Call the controller function to create an event
    createEvent(req, res, next);
});

// Fetch all events
router.get('/events', fetchAllEvents);

// Fetch event by ID
router.get('/events/:id', fetchEventById);

// Delete event by ID
router.delete('/events/:id', deleteEvent);

// Update event by ID
router.put('/events/:id', upload, (req, res, next) => {
    // Log uploaded file names during the update
    if (req.files) {
        if (req.files.sectionImages) {
            req.files.sectionImages.forEach(file => {
                console.log('Updated Section Image:', file.originalname);
            });
        }
        
        if (req.files.subsectionImages) {
            req.files.subsectionImages.forEach(file => {
                console.log('Updated Subsection Image:', file.originalname);
            });
        }
    } else {
        console.log('No files uploaded during update.');
    }

    // Call the update event controller function
    updateEvent(req, res, next);
});

// Export the router
module.exports = router;
