const express = require('express');
const router = express.Router();
const monthlySalesController = require('../controllers/monthlySalesController');
const multer = require('multer');
const path = require('path');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save files in 'public/uploads' directory
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for each file
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Routes for monthly sales
router.post('/', upload.single('image'), monthlySalesController.createMonthlySale);
router.get('/', monthlySalesController.getAllMonthlySales);
router.get('/:id', monthlySalesController.getMonthlySaleById);
router.put('/:id', upload.single('image'), monthlySalesController.updateMonthlySale);
router.delete('/:id', monthlySalesController.deleteMonthlySaleById);

module.exports = router;
