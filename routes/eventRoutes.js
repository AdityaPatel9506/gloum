const express = require('express');
const multer = require('multer');
const path = require('path');
const { createEvent, fetchAllEvents, fetchEventById, deleteEvent ,updateEvent} = require('../controllers/eventController'); // Import methods from the controller

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.body);
        console.log(req.file);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).fields([
    { name: 'sectionImages', maxCount: 5 },
    { name: 'subsectionImages', maxCount: 5 }
]);

// Routes
router.post('/events', upload, (req, res, next) => {
    // Log file names for sectionImages and subsectionImages
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

    // Call the controller function
    createEvent(req, res, next);
});

router.get('/events', fetchAllEvents);  // Route for fetching all events
router.get('/events/:id', fetchEventById);  // Route for fetching event by ID
router.delete('/events/:id', deleteEvent);  // Route for deleting event by ID
// router.put('/events/:id', upload, updateEvent);

router.put('/events/:id', upload, (req, res, next) => {
    // Log file names for sectionImages and subsectionImages on update
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

module.exports = router;  // Export the router
