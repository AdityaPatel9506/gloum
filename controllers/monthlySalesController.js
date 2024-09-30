const db = require('../config/db'); // Your database connection

// Create a new monthly sale
const createMonthlySale = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const query = `
            INSERT INTO monthly_sales (name, description, price, image_url, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [name, description, price, image]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all monthly sales
const getAllMonthlySales = async (req, res) => {
    try {
        const query = 'SELECT * FROM monthly_sales';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a monthly sale by ID
const getMonthlySaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM monthly_sales WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a monthly sale by ID
const updateMonthlySale = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const query = `
            UPDATE monthly_sales
            SET name = ?, description = ?, price = ?, image_url = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [name, description, price, image, id]);
        res.json({ updated: result.affectedRows > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a monthly sale by ID
const deleteMonthlySaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM monthly_sales WHERE id = ?';
        const [result] = await db.query(query, [id]);
        res.json({ deleted: result.affectedRows > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMonthlySale,
    getAllMonthlySales,
    getMonthlySaleById,
    updateMonthlySale,
    deleteMonthlySaleById
};
