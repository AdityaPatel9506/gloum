const db = require('../config/db'); // Your database connection

// Create a new product
const createProduct = async (req, res) => {
    const { name, description, price, blog_id } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const query = `
            INSERT INTO products (name, description, price, blog_id, image_url , created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [name, description, price, blog_id, image]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const query = 'SELECT * FROM products';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by blog ID
const getProductsByBlogId = async (req, res) => {
    console.log(req.params);
    
    const { blog_id } = req.params;
    try {
        const query = 'SELECT * FROM products WHERE blog_id = ?';
        const [rows] = await db.query(query, [blog_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, blog_id } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const query = `
            UPDATE products
            SET name = ?, description = ?, price = ?, blog_id = ?, image_url  = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [name, description, price, blog_id, image, id]);
        res.json({ updated: result.affectedRows > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.query(query, [id]);
        res.json({ deleted: result.affectedRows > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByBlogId,
    updateProduct,
    deleteProductById
};
