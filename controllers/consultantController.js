const bcrypt = require('bcrypt');
const Consultant = require('../models/consultant');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const fs = require('fs');

const secretKey = process.env.JWT_SECRET; 
// Add a new consultant
const addConsultant = async (req, res) => {
    const {
        username,
        email,
        password,
        online_status = 'offline',
        charges = 0, // Default charges to 0
        intro,
        specialization, // New field
        languages, // New field
        experience // New field
    } = req.body;

    // Log the file details if uploaded
    console.log(req.file);
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
        
        // Store the image path
        const imagePath = req.file ? req.file.path : null; // Path of the uploaded image

        // Create a new consultant in the database with the updated fields
        const consultantId = await Consultant.createConsultant(
            username,
            email,
            hashedPassword,
            online_status,
            charges, // Now storing charges instead of points
            intro,
            imagePath,
            specialization, // New field
            languages, // New field
            experience // New field
        );
        console.log("Consultant ID is " + consultantId);

        res.status(201).json({ message: 'Consultant created successfully.', consultantId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating consultant', error: error.message });
    }
};

// Login consultant
// Use the JWT_SECRET from environment variables
const loginConsultant = async (req, res) => {
    const { email, password } = req.body;
    console.log('Request Body:', req.body); // Log the entire request body

    // Log the decrypted password (plain text)
    console.log('Decrypted Password:', password); // Logging the plain text password for debugging

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

        // Successful login - Generate the token
        const token = jwt.sign(
            {
                email: consultant.email,
                userType: 'consultant',
                consultantId: consultant.consultant_id // Add consultant ID to the token payload
            },
            secretKey,
            { expiresIn: '10h' }
        );

        // Set the token in an HTTP-only cookie with security options
        res.cookie('gloum_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Change to 'Lax' if cross-origin requests are needed
        });

        // Return a success message along with consultant details (excluding sensitive data)
        res.status(200).json({
            message: 'Login successful.',
            consultantId: consultant.consultant_id,
            username: consultant.username,
            token: token // Include the token in the response
        });
    } catch (error) {
        console.error('Error logging in consultant:', error); // Log the error details
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


const updateConsultantData = async (req, res) => {
    const consultantId = req.body.consultantId; // Assuming consultantId is sent in the body
    const {
        username,
        email,
        password,
        online_status,
        charges, // Replace points with charges
        intro,
        specialization, // New field
        languages, // New field
        experience // New field
    } = req.body;
    const imagePath = req.file ? req.file.path : null; // Use the uploaded image path if available

    try {
        // Fetch the existing consultant to retrieve the old values
        const [existingConsultant] = await db.query('SELECT * FROM consultants WHERE consultant_id = ?', [consultantId]);

        // If the consultant exists
        if (existingConsultant.length > 0) {
            const oldConsultant = existingConsultant[0];

            // Prepare the values to update
            const updatedUsername = username || oldConsultant.username;
            const updatedEmail = email || oldConsultant.email;

            // Hash the new password if it is provided, otherwise retain the old password
            const updatedPassword = password ? await bcrypt.hash(password, 10) : oldConsultant.password;

            const updatedOnlineStatus = online_status || oldConsultant.online_status;
            const updatedCharges = charges || oldConsultant.charges; // Replace points with charges
            const updatedIntro = intro || oldConsultant.intro;
            const updatedImagePath = imagePath || oldConsultant.image; // Retain old image if new one is not provided

            // Update the new fields
            const updatedSpecialization = specialization || oldConsultant.specialization; // New field
            const updatedLanguages = languages || oldConsultant.languages; // New field
            const updatedExperience = experience || oldConsultant.experience; // New field

            // Update the consultant data in the database with new structure
            await db.query(
                `UPDATE consultants SET username = ?, email = ?, password = ?, online_status = ?, charges = ?, intro = ?, image = ?, 
                 specialization = ?, languages = ?, experience = ? WHERE consultant_id = ?`,
                [
                    updatedUsername,
                    updatedEmail,
                    updatedPassword,
                    updatedOnlineStatus,
                    updatedCharges,
                    updatedIntro,
                    updatedImagePath,
                    updatedSpecialization, // New field
                    updatedLanguages, // New field
                    updatedExperience, // New field
                    consultantId
                ]
            );

            // If a new image has been uploaded, delete the old image from the filesystem
            if (imagePath && oldConsultant.image) {
                fs.unlink(oldConsultant.image, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    }
                });
            }

            return res.status(200).json({ message: 'Consultant updated successfully' });
        } else {
            return res.status(404).json({ message: 'Consultant not found' });
        }
    } catch (error) {
        console.error('Error updating consultant:', error);
        return res.status(500).json({ error: 'Error updating consultant' });
    }
};

// Get all consultants
const getAllConsultants = async (req, res) => {
    try {
        const consultants = await Consultant.getAllConsultants();
        // console.log(consultants);
         
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
console.log(consultantId);

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
    updateConsultantData,
    getAllConsultants,
    getConsultantById,
    deleteConsultant,
};
