const express = require('express');
const Story = require('../models/Story');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Add new chapter to a story
router.post('/add/:storyId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { storyId } = req.params;
        const { title, content, isPublished } = req.body;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ error: 'Story not found' });

        // Verify that the requesting user is the author of the story
        if (story.author.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the author of this story' });
        }

        // Save to the chapter db
        const chapterDoc = new Chapter({
            story: storyId,
            title,
            content,
            isPublished: isPublished || false,
            createdAt: new Date()
        });
        await chapterDoc.save();

        // Add chapter reference to the story
        story.chapters.push(chapterDoc._id);
        await story.save();

        res.status(201).json({ message: 'Chapter added successfully', chapter: chapterDoc });
    } catch (err) {
        console.error('❌ Error adding chapter:', err);
        res.status(500).json({ error: err.message });
    }
});

// Edit chapter details
router.put('/edit/:chapterId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { chapterId } = req.params;
        const { title, content, isPublished } = req.body;

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

        // const story = await Story.findById(chapter.story);
        // if (!story) return res.status(404).json({ error: 'Story not found' });

        // Verify that the requesting user is the author of the story
        // if (story.author.toString() !== userId) {
        //     return res.status(403).json({ error: 'Forbidden: You are not the author of this story' });
        // }

        // Update chapter details
        chapter.title = title || chapter.title;
        chapter.content = content || chapter.content;
        if (isPublished !== undefined) {
            chapter.isPublished = isPublished;
        }
        await chapter.save();

        res.status(200).json({ message: 'Chapter updated successfully', chapter });
    } catch (err) {
        console.error('❌ Error updating chapter:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get chapter details
router.get('/:chapterId', async (req, res) => {
    try {
        const { chapterId } = req.params;
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

        // console.log('✅ Chapter fetched successfully:', chapter);
        res.status(200).json(chapter);
    } catch (err) {
        console.error('❌ Error fetching chapter:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a chapter from a story
router.delete('/:storyId/:chapterId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { storyId, chapterId } = req.params;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ error: 'Story not found' });

        // Verify that the requesting user is the author of the story
        if (story.author.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the author of this story' });
        }

        // Remove chapter reference from the story
        story.chapters = story.chapters.filter(id => id.toString() !== chapterId);
        await story.save();

        // Delete the chapter
        await Chapter.findByIdAndDelete(chapterId);

        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting chapter:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
