const Service = require('../models/servicesModel');

// Create a new service
const createService = async (req, res) => {
    const { name, type, description, price, discount_percentage, blog_id } = req.body;
    console.log("create called");
    console.log(req.body);

    // Validate required fields
    if (!name || !type || !description || !price || !discount_percentage || !blog_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const serviceId = await Service.createService({
            name,
            type,
            description,
            price,
            discountPercentage: discount_percentage,
            blogId: blog_id
        });
        return res.status(201).json({ id: serviceId });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating service: ' + error.message });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.getAllServices();
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching services: ' + error.message });
    }
};

// Get services by blog ID
const getServicesByBlogId = async (req, res) => {
    const blogId = parseInt(req.params.blog_id, 10);
    try {
        const services = await Service.getServicesByBlogId(blogId);
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching services for blog: ' + error.message });
    }
};

// Get a service by ID
const getServiceById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const service = await Service.getServiceById(id);
        if (service) {
            return res.json(service);
        } else {
            return res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching service: ' + error.message });
    }
};

// Update a service by ID
const updateService = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, type, description, price, discount_percentage, blog_id } = req.body;
    try {
        const updated = await Service.updateService(id, {
            name,
            type,
            description,
            price,
            discountPercentage: discount_percentage,
            blogId: blog_id
        });
        if (updated) {
            return res.json({ message: 'Service updated successfully' });
        } else {
            return res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating service: ' + error.message });
    }
};

// Delete a service by ID
const deleteServiceById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deleted = await Service.deleteServiceById(id);
        if (deleted) {
            return res.json({ message: 'Service deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting service: ' + error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getServicesByBlogId,
    updateService,
    deleteServiceById
};
