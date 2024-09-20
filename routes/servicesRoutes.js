const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/servicesController');

// Create a new service
router.post('/services', serviceController.createService);

// Get all services
router.get('/services', serviceController.getAllServices);

// Get services by blog ID
router.get('/services/blog/:blog_id', serviceController.getServicesByBlogId);

// Get a service by ID
router.get('/services/:id', serviceController.getServiceById);

// Update a service
router.put('/services/:id', serviceController.updateService);

// Delete a service
router.delete('/services/:id', serviceController.deleteServiceById);

module.exports = router;
