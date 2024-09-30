// const express = require('express');
// const consultantController = require('../controllers/consultantController');

// const router = express.Router();

// // Route to add a new consultant
// router.post('/add', consultantController.addConsultant);

// // Route to log in a consultant
// router.post('/login', consultantController.loginConsultant); // Add this route

// // Route to update an existing consultant
// router.put('/update', consultantController.updateConsultant);

// // Route to get all consultants
// router.get('/', consultantController.getAllConsultants);

// // Route to get a specific consultant by ID
// router.get('/:id', consultantController.getConsultantById);

// // Route to delete a consultant
// router.delete('/:consultantId', consultantController.deleteConsultant);

// module.exports = router;
const express = require('express');
const consultantController = require('../controllers/consultantController');
const { authenticate, authenticateConsultant } = require('../middlewares/authMiddleware'); // Adjust the path as needed

const router = express.Router();

// Route to add a new consultant (open to all, can use authentication if needed)
router.post('/add', authenticate, consultantController.addConsultant);

// Route to log in a consultant (open to all)
router.post('/login', consultantController.loginConsultant);

// Route to update an existing consultant (authenticated consultants only)
router.put('/update', authenticate, authenticateConsultant, consultantController.updateConsultant);

// Route to get all consultants (authenticated consultants only)
router.get('/', authenticate, authenticateConsultant, consultantController.getAllConsultants);

// Route to get a specific consultant by ID (authenticated consultants only)
router.get('/:id', authenticate, authenticateConsultant, consultantController.getConsultantById);

// Route to delete a consultant (authenticated consultants only)
router.delete('/:consultantId', authenticate, authenticateConsultant, consultantController.deleteConsultant);

module.exports = router;
