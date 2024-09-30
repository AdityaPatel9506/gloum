const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
// Create a new admin
const addAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new admin
        const adminId = await Admin.createAdmin(username, email, hashedPassword);
        res.status(201).json({ message: 'Admin created successfully', adminId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.getAdminByEmail(email);
        console.log(admin);
        
        if (admin && await bcrypt.compare(password, admin.password)) { // Compare hashed password
            // Generate JWT token
            const token = jwt.sign(
                { adminId: admin.admin_id, userType: 'admin' }, // Payload
                process.env.JWT_SECRET, // Your secret key
                { expiresIn: '3h' } // Token expiration
            );

            // Optionally store the token in local storage on the client side
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
// Get an admin by ID
const getAdminById = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.getAdminById(adminId);
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admin', error: error.message });
    }
};

// Get an admin by email
const getAdminByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const admin = await Admin.getAdminByEmail(email);
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admin', error: error.message });
    }
};

// Update an admin
const updateAdmin = async (req, res) => {
    const { adminId } = req.params;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update admin
        const affectedRows = await Admin.updateAdmin(adminId, username, email, hashedPassword);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Admin updated successfully' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message });
    }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const affectedRows = await Admin.deleteAdmin(adminId);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Admin deleted successfully' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
};

module.exports = {
    addAdmin,
    getAdminById,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin,
    loginAdmin
};
