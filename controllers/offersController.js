const Offer = require('../models/offersModel');

// Create a new offer
const createOffer = async (req, res) => {
    console.log(req);
    const { title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id } = req.body;
    try {
        const offerId = await Offer.createOffer({
            title,
            description,
            start_date,
            end_date,
            discount_percentage,
            coupon_code,
            product_id,
            service_id,
            blog_id
        });
        return res.status(201).json({ id: offerId });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating offer: ' + error.message });
    }
};

// Get all offers
const getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.getAllOffers();
        return res.json(offers);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching offers: ' + error.message });
    }
};

// Get offers by product ID
const getOffersByProductId = async (req, res) => {
    const productId = parseInt(req.params.product_id, 10);
    try {
        const offers = await Offer.getOffersByProductId(productId);
        return res.json(offers);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching offers for product: ' + error.message });
    }
};

// Get offers by service ID
const getOffersByServiceId = async (req, res) => {
    const serviceId = parseInt(req.params.service_id, 10);
    try {
        const offers = await Offer.getOffersByServiceId(serviceId);
        return res.json(offers);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching offers for service: ' + error.message });
    }
};

// Get an offer by ID
const getOfferById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const offer = await Offer.getOfferById(id);
        if (offer) {
            return res.json(offer);
        } else {
            return res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching offer: ' + error.message });
    }
};

// Update an offer by ID
const updateOffer = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id } = req.body;
    try {
        const updated = await Offer.updateOffer(id, {
            title,
            description,
            start_date,
            end_date,
            discount_percentage,
            coupon_code,
            product_id,
            service_id,
            blog_id
        });
        if (updated) {
            return res.json({ message: 'Offer updated successfully' });
        } else {
            return res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating offer: ' + error.message });
    }
};

// Delete an offer by ID
const deleteOfferById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deleted = await Offer.deleteOfferById(id);
        if (deleted) {
            return res.json({ message: 'Offer deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting offer: ' + error.message });
    }
};

module.exports = {
    createOffer,
    getAllOffers,
    getOffersByProductId,
    getOffersByServiceId,
    getOfferById,
    updateOffer,
    deleteOfferById
};
