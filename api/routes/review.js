const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Story = require('../models/Story');
const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');


// Create a new review
router.post('/:storyId', async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const newReview = new Review(
            {
                story: req.params.storyId,
                content: req.body.content,
                rating: req.body.rating,
                user: userId
            }   
        ).populate('user', 'username');
        const savedReview = await newReview.save();

        // Save to story's reviews array
        await Story.findByIdAndUpdate(req.params.storyId, { $push: { reviews: savedReview._id } });
        // Save to user's reviews array
        await User.findByIdAndUpdate(userId, { $push: { reviews: savedReview._id } });

        res.status(201).json(savedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get reviews for a specific story
router.get('/story/:storyId', async (req, res) => {
    try {
        const reviews = await Review.find({ story: req.params.storyId }).populate('user', 'username');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a review
router.put('/:reviewId', async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Verify that the requesting user is the author of the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the author of this review' });
        }
        review.content = req.body.content || review.content;
        review.rating = req.body.rating || review.rating;
        await review.save();
        const updatedReview = await Review.findById(req.params.reviewId).populate('user', 'username');
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Like a review
router.post('/:reviewId/like', async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Check if user has already liked the review
        if (review.likedBy.includes(userId)) {
            review.likedBy = review.likedBy.filter(id => id.toString() !== userId);
            // return res.status(200).json({ message: 'You have unliked this review' });
        } else {
            review.likedBy.push(userId);
        }
        review.likes = review.likedBy.length;
        
        await review.save();

        const updatedReview = await Review.findById(req.params.reviewId).populate('user', 'username');
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;