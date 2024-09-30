// const express = require('express');
// const adminController = require('../controllers/adminController');

// const router = express.Router();

// // Route to create a new admin
// router.post('/add', adminController.addAdmin);

// // Route to get an admin by ID
// router.get('/:adminId', adminController.getAdminById);

// // Route to get an admin by email
// router.get('/email/:email', adminController.getAdminByEmail);

// // Route to update an admin
// router.put('/:adminId', adminController.updateAdmin);

// // Route to delete an admin
// router.delete('/:adminId', adminController.deleteAdmin);
// router.post('/login', adminController.loginAdmin);
// module.exports = router;


const express = require('express');
const { authenticate, authenticateAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Public route to login
router.post('/login', adminController.loginAdmin);

// Protected routes for admin actions
router.use(authenticate); // Apply to all routes below this line

router.post('/add', authenticateAdmin, adminController.addAdmin); // Only admins can add admins
router.get('/:adminId', authenticateAdmin, adminController.getAdminById);
router.get('/email/:email', authenticateAdmin, adminController.getAdminByEmail);
router.put('/:adminId', authenticateAdmin, adminController.updateAdmin);
router.delete('/:adminId', authenticateAdmin, adminController.deleteAdmin);

module.exports = router;
