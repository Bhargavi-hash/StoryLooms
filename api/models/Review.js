const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
