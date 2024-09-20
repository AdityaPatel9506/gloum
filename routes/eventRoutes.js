const express = require('express');
const multer = require('multer');
const path = require('path');
const { createEvent, fetchAllEvents, fetchEventById, updateEvent, deleteEvent } = require('../controllers/eventController');

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
router.post('/events', upload, createEvent);
router.get('/events', fetchAllEvents);
router.get('/events/:id', fetchEventById);
// router.put('/events/:id', upload, updateEvent);  // Update event route
// router.delete('/events/:id', deleteEvent);      // Delete event route

module.exports = router;
