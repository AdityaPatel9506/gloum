const db = require('../config/db'); // Adjust the path if necessary

// Define the schema for the offers table
const createOffer = async (data) => {
    console.log(data);
    const { title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id } = data;
    const query = `
        INSERT INTO offers (title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(query, [title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id]);
    return result.insertId; // Return the newly created offer ID
};

const getAllOffers = async () => {
    const query = 'SELECT * FROM offers';
    const [rows] = await db.query(query);
    return rows; // Return all offers
};

const getOffersByProductId = async (productId) => {
    const query = 'SELECT * FROM offers WHERE product_id = ?';
    const [rows] = await db.query(query, [productId]);
    return rows; // Return offers for the given productId
};

const getOffersByServiceId = async (serviceId) => {
    const query = 'SELECT * FROM offers WHERE service_id = ?';
    const [rows] = await db.query(query, [serviceId]);
    return rows; // Return offers for the given serviceId
};

const getOfferById = async (id) => {
    const query = 'SELECT * FROM offers WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null; // Return the offer or null if not found
};

const updateOffer = async (id, data) => {
    const { title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id } = data;
    const query = `
        UPDATE offers SET title = ?, description = ?, start_date = ?, end_date = ?, discount_percentage = ?, coupon_code = ?, product_id = ?, service_id = ?, blog_id = ?
        WHERE id = ?
    `;
    const [result] = await db.query(query, [title, description, start_date, end_date, discount_percentage, coupon_code, product_id, service_id, blog_id, id]);
    return result.affectedRows > 0; // Return true if the offer was updated, false otherwise
};

const deleteOfferById = async (id) => {
    const query = 'DELETE FROM offers WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0; // Return true if the offer was deleted, false otherwise
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
