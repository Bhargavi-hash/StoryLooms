const express = require('express');
const Story = require('../models/Story');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');


// Add story to user's library
router.post('/add-to-library/:storyId', async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        // console.log('Received token:', token);
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded JWT:', decoded);
        const userId = decoded.id;

        const { storyId } = req.params;

        // Find the user and add the story to their library
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.library.includes(storyId)) {
            return res.status(400).json({ error: 'Story already in library' });
        }

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ error: 'Story not found' });

        // Update fields before saving
        story.collections = (story.collections || 0) + 1;

        if (!story.libraryReaders.includes(userId)) {
            story.libraryReaders.push(userId);
        }
        await story.save();

        user.library.push(storyId);
        await user.save();

        res.json({ message: 'Story added to library successfully' });
    } catch (err) {
        console.error('❌ Error adding story to library:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get user's library
router.get('/library', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId).populate('library');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user.library);
    } catch (err) {
        console.error('❌ Error fetching user library:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete story from user's library
router.delete('/remove-from-library/:storyId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { storyId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.library = user.library.filter(id => id.toString() !== storyId);
        await user.save();
        // Decrement the collections count in Story model
        const story = await Story.findById(storyId);
        if (story) {
            story.collections = Math.max((story.collections || 1) - 1, 0);
            story.libraryReaders = story.libraryReaders.filter(id => id.toString() !== userId);
            await story.save();
        }

        // 🩹 Return the updated library array
        console.log('Updated library:', user.library);
        res.json({ library: user.library });
    } catch (err) {
        console.error('❌ Error removing story from library:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
