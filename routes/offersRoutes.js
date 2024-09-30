const express = require('express');
const router = express.Router();
const offersController = require('../controllers/offersController');

// Create a new offer
router.post('/', offersController.createOffer);

// Get all offers
router.get('/', offersController.getAllOffers);

// Get an offer by ID
router.get('/:id', offersController.getOfferById);

// Get offers by product ID
router.get('/product/:product_id', offersController.getOffersByProductId);

// Get offers by service ID
router.get('/service/:service_id', offersController.getOffersByServiceId);

// Update an offer by ID
router.put('/:id', offersController.updateOffer);

// Delete an offer by ID
router.delete('/:id', offersController.deleteOfferById);

module.exports = router;
