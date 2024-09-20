const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productsController');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save files in 'public/uploads' directory
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for each file
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Create a new product
router.post('/', upload.single('image'), productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Get products by blog ID
router.get('/blog/:blog_id', productController.getProductsByBlogId);

// Update a product by ID
router.put('/:id', upload.single('image'), productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
