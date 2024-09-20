// controllers/blogController.js
const db = require('../config/db'); // Your database connection

// Function to get related services, offers, and products for a blog
const getBlogRelations = async (req, res) => {
    const blogId = req.params.id; // Assuming blog_id is a number or string

    try {
        // Fetch related services
        const [services] = await db.query(`
            SELECT s.* FROM services s
            JOIN blog_services bs ON s.id = bs.service_id
            WHERE bs.blog_id = ?
        `, [blogId]);

        // Fetch related offers
        const [offers] = await db.query(`
            SELECT o.* FROM offers o
            JOIN blog_offers bo ON o.id = bo.offer_id
            WHERE bo.blog_id = ?
        `, [blogId]);

        // Fetch related products
        const [products] = await db.query(`
            SELECT p.* FROM products p
            JOIN blog_products bp ON p.id = bp.product_id
            WHERE bp.blog_id = ?
        `, [blogId]);

        res.json({
            services,
            offers,
            products
        });
    } catch (error) {
        res.status(500).send('Error fetching blog relations: ' + error.message);
    }
};

module.exports = {
    getBlogRelations
};
