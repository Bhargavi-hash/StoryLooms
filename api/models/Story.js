const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  // ---- Basic Info ----
  title: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 5000 },
  
  coverUrl: { type: String },
  bannerUrl: { type: String }, // for featured stories or collections

  // ---- Author & Ownership ----
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coAuthors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // optional collaborations
  isVerifiedAuthor: { type: Boolean, default: false },

  // ---- Content ----
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  // ---- Tags, Genre, Metadata ----
  // tags: [{ type: String, lowercase: true, trim: true }],
  genre: { type: String, enum: ['fantasy', 'romance', 'sci-fi', 'thriller', 'slice-of-life', 'horror', 'other'], default: 'other' },
  language: { type: String, default: 'en' },
  isCompleted: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 },
  matureContent: { type: Boolean, default: false },

  // ---- Engagement & Analytics ----
  libraryReaders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  reads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
//   bookmarks: { type: Number, default: 0 },
  collections: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  averageReadTime: { type: Number, default: 0 }, // in minutes
  popularityScore: { type: Number, default: 0 }, // precomputed metric for sorting

  // ---- Publication Control ----
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  publicationStatus: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },

  // ---- Moderation ----
  flagged: { type: Boolean, default: false },
  flagReason: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNotes: { type: String },

  // ---- Audit & Lifecycle ----
  
  publishedAt: { type: Date },

  // ---- Misc / Extensibility ----
  meta: {
    isFeatured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    source: { type: String, default: 'user' }, // could be imported, contest, etc.
  }
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('Story', storySchema);
