const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    wordCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    reads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
