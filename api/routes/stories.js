const express = require('express');
const Story = require('../models/Story');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');

// GET all stories
router.get('/', async (req, res) => {
  const stories = await Story.find();
  res.json(stories);
});

// POST new story
router.post('/', async (req, res) => {
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

    const story = new Story({
      title: req.body.title,
      description: req.body.description,
      author: userId,
    });

    // console.log(story);

    await story.save();
    res.status(201).json({ message: 'Story created successfully', story });

    // Add the storyID to the author's list of stories
    const user = await User.findById(userId);
    if (user) {
      user.stories.push(story._id);
      await user.save();
    } else {
      console.log('❌ Author user not found for story creation');
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    console.error('❌ Error creating story:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET all stories in the database
router.get('/all', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error('❌ Error fetching all stories:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET one story
router.get('/:id', async (req, res) => {
  const story = await Story.findById(req.params.id).populate('author', 'username');
  if (!story) return res.status(404).json({ error: 'Story not found' });
  res.json(story);
});


// GET all stories by a specific creator
router.get('/creator-works/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('Fetching stories for creator:', username);

    const user = await User.findOne({ username }).populate({
      path: 'stories',
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`Found ${user.stories.length} stories for user ${username}`);

    if (!user.stories || user.stories.length === 0) {
      return res.json({ message: 'No stories found for this creator', stories: [] });
    }

    // const stories = await Story.find({ author: user._id });
    res.json(user.stories);
  } catch (err) {
    console.error('❌ Error fetching creator works:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    // Also remove the story reference from the author's stories array
    const user = await User.findById(story.author);
    if (user) {
      user.stories = user.stories.filter(storyId => storyId.toString() !== req.params.id);
      await user.save();
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting story:', err);
    res.status(500).json({ error: err.message });
  }
});

// Edit story details
router.put('/:id', async (req, res) => {
  try {
    const { title, description, genre } = req.body;
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    story.title = title || story.title;
    story.description = description || story.description;
    story.genre = genre || story.genre;

    await story.save();
    res.json({ message: 'Story updated successfully', story });
  } catch (err) {
    console.error('❌ Error updating story:', err);
    res.status(500).json({ error: err.message });
  }
});

// Chapter editing route can be added here

module.exports = router;
