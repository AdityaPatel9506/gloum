const db = require('../config/db'); // Your MySQL connection instance

// Create a new product
const createProduct = async (data) => {
    const { name, description, price, blog_id, imagePath } = data;
    const query = `
        INSERT INTO products (name, description, price, blog_id, image_url   , created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(query, [name, description, price, blog_id, imagePath]);
    return result.insertId;  // Return the newly created product ID
};

// Get all products
const getAllProducts = async () => {
    const query = 'SELECT * FROM products';
    const [rows] = await db.query(query);
    return rows;  // Return all products
};

// Get a product by ID
const getProductById = async (id) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;  // Return the product or null if not found
};

// Get products by blog ID
const getProductsByBlogId = async (blog_id) => {
    const query = 'SELECT * FROM products WHERE blog_id = ?';
    const [rows] = await db.query(query, [blog_id]);
    return rows;  // Return products for the given blog_id
};

// Update a product by ID
const updateProduct = async (id, data) => {
    const { name, description, price, blog_id, imagePath } = data;
    const query = `
        UPDATE products SET name = ?, description = ?, price = ?, blog_id = ?, image_url = ?
        WHERE id = ?
    `;
    const [result] = await db.query(query, [name, description, price, blog_id, imagePath, id]);
    return result.affectedRows > 0;  // Return true if the product was updated, false otherwise
};

// Delete a product by ID
const deleteProductById = async (id) => {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;  // Return true if the product was deleted, false otherwise
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByBlogId,
    updateProduct,
    deleteProductById
};
