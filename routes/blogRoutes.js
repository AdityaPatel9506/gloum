// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/:id/relations', blogController.getBlogRelations);

module.exports = router;
