const db = require('../config/db'); // Your MySQL connection instance

// Create a new service
const createService = async (data) => {
    const { name, type, description, price, discountPercentage, blogId } = data;
    const query = `
        INSERT INTO services (name, type, description, price, discount_percentage, blog_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(query, [name, type, description, price, discountPercentage, blogId]);
    return result.insertId;  // Return the newly created service ID
};

// Get all services
const getAllServices = async () => {
    const query = 'SELECT * FROM services';
    const [rows] = await db.query(query);
    return rows;  // Return all services
};

// Get services by blog ID
const getServicesByBlogId = async (blogId) => {
    const query = 'SELECT * FROM services WHERE blog_id = ?';
    const [rows] = await db.query(query, [blogId]);
    return rows;  // Return services for the given blogId
};

// Get a service by ID
const getServiceById = async (id) => {
    const query = 'SELECT * FROM services WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;  // Return the service or null if not found
};

// Update a service by ID
const updateService = async (id, data) => {
    const { name, type, description, price, discountPercentage, blogId } = data;
    const query = `
        UPDATE services SET name = ?, type = ?, description = ?, price = ?, discount_percentage = ?, blog_id = ?
        WHERE id = ?
    `;
    const [result] = await db.query(query, [name, type, description, price, discountPercentage, blogId, id]);
    return result.affectedRows > 0;  // Return true if the service was updated, false otherwise
};

// Delete a service by ID
const deleteServiceById = async (id) => {
    const query = 'DELETE FROM services WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;  // Return true if the service was deleted, false otherwise
};

module.exports = {
    createService,
    getAllServices,
    getServicesByBlogId,
    getServiceById,
    updateService,
    deleteServiceById
};
