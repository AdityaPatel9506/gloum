const userModel = require('../models/userModel'); // Adjust the path to your user model

// Controller to get user profile by ID
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user by authentication middleware
        const user = await userModel.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to update user profile by ID
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user by authentication middleware
        const updates = req.body; // Collect update data from request body
        const result = await userModel.updateUserById(userId, updates);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to delete user profile by ID
const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user by authentication middleware
        const result = await userModel.deleteUserById(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};
