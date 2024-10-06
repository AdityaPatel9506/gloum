const express = require('express');
const multer = require('multer');
const consultantController = require('../controllers/consultantController');
const { authenticate, authenticateConsultant } = require('../middlewares/authMiddleware'); // Adjust the path as needed
const path = require('path');

const router = express.Router();

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/consultants'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route to add a new consultant (open to all, can use authentication if needed)
router.post('/add',  upload.single('profileImage'), consultantController.addConsultant);

// Route to log in a consultant (open to all)
router.post('/login', consultantController.loginConsultant);

// Route to update an existing consultant (authenticated consultants only)
router.put('/update',  consultantController.updateConsultant);

// Route to update an existing consultant (authenticated consultants only)
router.put('/update-consultant',  upload.single('profileImage'), consultantController.updateConsultantData);

// Route to get all consultants (authenticated consultants only)
router.get('/', consultantController.getAllConsultants);

// Route to get a specific consultant by ID (authenticated consultants only)
router.get('/:id', consultantController.getConsultantById);

// Route to delete a consultant (authenticated consultants only)
router.delete('/:consultantId',  consultantController.deleteConsultant);

module.exports = router;
