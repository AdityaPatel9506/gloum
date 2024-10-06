const db = require('../config/db');
const fs = require('fs');
const path = require('path');
// Create a new blog post
// Create a new blog post
const createBlogPost = async (req, res) => {
    const { title, content, tags } = req.body; // Now includes tags
    const image = req.file ? req.file.path : null; // Get the uploaded image path

    console.log({ title, content, image, tags }); // Log all values to check

    const query = 'INSERT INTO blogs (title, content, image, tags) VALUES (?, ?, ?, ?)';

    try {
        const [results] = await db.execute(query, [title, content, image, tags]);
        return res.status(201).json({ id: results.insertId, title, content, image, tags });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all blog posts
const getAllBlogPosts = async (req, res) => {
    const query = 'SELECT * FROM blogs';

    try {
        const [results] = await db.execute(query);
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a blog post by ID
const getBlogPostById = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM blogs WHERE blog_id = ?';
    console.log("blog id");
    

    try {
        const [results] = await db.execute(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        return res.status(200).json(results[0]);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const newImage = req.file ? req.file.path : null; // Get the uploaded image path

    // Fetch the existing blog post to get the current values
    const getBlogPostQuery = 'SELECT * FROM blogs WHERE blog_id = ?';

    try {
        const [results] = await db.execute(getBlogPostQuery, [id]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const existingPost = results[0];

        // Use existing values if new values are not provided
        const updatedTitle = title || existingPost.title;
        const updatedContent = content || existingPost.content;
        const updatedTags = tags || existingPost.tags;
        const updatedImage = newImage || existingPost.image; // Keep existing image if no new image is provided

        // Delete the old image from disk if a new image is uploaded
        if (newImage && existingPost.image) {
            const oldImagePath = path.join(__dirname, '..', existingPost.image); // Construct the full path to the old image
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                }
            });
        }

        const updateQuery = 'UPDATE blogs SET title = ?, content = ?, image = ?, tags = ? WHERE blog_id = ?';
        const [updateResults] = await db.execute(updateQuery, [updatedTitle, updatedContent, updatedImage, updatedTags, id]);

        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        return res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error) {
        console.error('Error updating blog post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM blogs WHERE blog_id = ?';

    try {
        const [results] = await db.execute(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export methods
module.exports = {
    createBlogPost,
    getAllBlogPosts,
    getBlogPostById,
    updateBlogPost,
    deleteBlogPost,
};
