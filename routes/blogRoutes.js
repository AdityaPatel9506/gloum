const express = require('express');
const multer = require('multer');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/blogs'); // Set the destination for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
    }
});

const upload = multer({ storage: storage });

// CRUD routes for blog posts
router.post('/', upload.single('image'), blogController.createBlogPost); // Create a new blog post
router.get('/', blogController.getAllBlogPosts); // Get all blog posts
router.get('/:id', blogController.getBlogPostById); // Get a blog post by ID
router.put('/:id', upload.single('image'), blogController.updateBlogPost); // Update a blog post
router.delete('/:id', blogController.deleteBlogPost); // Delete a blog post

module.exports = router;
