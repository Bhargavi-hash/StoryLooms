const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Chapter = require('../models/Chapter');
const Comment = require('../models/Comment');
require('dotenv').config();

// Utility function to decode token
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// Helper: add comment to parent document
const attachToParent = async (parentType, parentId, commentId) => {
  if (parentType === "Review") {
    await Review.findByIdAndUpdate(parentId, { $push: { replies: commentId } });
  } else if (parentType === "Chapter") {
    await Chapter.findByIdAndUpdate(parentId, { $push: { comments: commentId } });
  } else if (parentType === "Comment") {
    await Comment.findByIdAndUpdate(parentId, { $push: { replies: commentId } });
  }
};

// 🧠 Create comment (for review, chapter, or another comment)
router.post('/:parentType/:parentId', async (req, res) => {
  try {
    const { parentType, parentId } = req.params;
    const { content } = req.body;
    const userId = verifyToken(req);

    if (!["Review", "Chapter", "Comment"].includes(parentType))
      return res.status(400).json({ error: "Invalid parent type" });

    let newComment = new Comment({
      user: userId,
      content,
      parentType,
      parentId,
    });

    let savedComment = await newComment.save();
    await attachToParent(parentType, parentId, savedComment._id);

    savedComment = await savedComment.populate('user', 'username');

    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// 🧾 Get comments for a specific parent (review, chapter, or comment)
router.get('/:parentType/:parentId', async (req, res) => {
  try {
    const { parentType, parentId } = req.params;
    if (!["Review", "Chapter", "Comment"].includes(parentType))
      return res.status(400).json({ error: "Invalid parent type" });

    const comments = await Comment.find({ parentType, parentId })
      .populate('user', 'username')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username' },
      })
      .exec();

    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
