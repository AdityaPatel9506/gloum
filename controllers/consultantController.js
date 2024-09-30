const bcrypt = require('bcrypt');
const Consultant = require('../models/consultant');

// Add a new consultant
const addConsultant = async (req, res) => {
    const { username, email, password, online_status = 'offline', points = 0, intro } = req.body; // Default values for online_status and points
    console.log(req.body);

    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields: username, email, and password are required.' });
    }

    // Validate online_status
    const validStatuses = ['online', 'offline', 'busy'];
    if (!validStatuses.includes(online_status)) {
        return res.status(400).json({ message: 'Invalid online_status. Must be one of: online, offline, busy.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new consultant in the database
        const consultantId = await Consultant.createConsultant(username, email, hashedPassword, online_status, points, intro);
        res.status(201).json({ message: 'Consultant created successfully.', consultantId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating consultant', error: error.message });
    }
};

// Login consultant
const loginConsultant = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields: email and password are required.' });
    }

    try {
        // Retrieve consultant from the database
        const consultant = await Consultant.getConsultantByEmail(email);
        if (!consultant) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, consultant.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful.', consultantId: consultant.consultant_id, username: consultant.username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in consultant', error: error.message });
    }
};

// Update consultant's status and points
const updateConsultant = async (req, res) => {
    const { consultantId, online_status, points } = req.body;

    // Validate online_status
    const validStatuses = ['online', 'offline', 'busy'];
    if (online_status && !validStatuses.includes(online_status)) {
        return res.status(400).json({ message: 'Invalid online_status. Must be one of: online, offline, busy.' });
    }

    try {
        const affectedRows = await Consultant.updateConsultant(consultantId, online_status, points);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Consultant updated successfully.' });
        } else {
            res.status(404).json({ message: 'Consultant not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating consultant', error: error.message });
    }
};

// Get all consultants
const getAllConsultants = async (req, res) => {
    try {
        const consultants = await Consultant.getAllConsultants();
        res.status(200).json(consultants);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving consultants', error: error.message });
    }
};

// Get a consultant by ID
const getConsultantById = async (req, res) => {
    const { id } = req.params;

    try {
        const consultant = await Consultant.getConsultantById(id);
        if (consultant) {
            res.status(200).json(consultant);
        } else {
            res.status(404).json({ message: 'Consultant not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving consultant', error: error.message });
    }
};

// Delete a consultant
const deleteConsultant = async (req, res) => {
    const { consultantId } = req.params;

    try {
        const affectedRows = await Consultant.deleteConsultant(consultantId);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Consultant deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Consultant not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting consultant', error: error.message });
    }
};

module.exports = {
    addConsultant,
    loginConsultant, // Add loginConsultant to exported methods
    updateConsultant,
    getAllConsultants,
    getConsultantById,
    deleteConsultant,
};
