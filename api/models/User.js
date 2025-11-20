const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ---- Core Identity ----
  username: { type: String, required: true, unique: true, trim: true },
  profilename: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // exclude by default

  // ---- Library & Author Stories ----
  library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  // ---- Role & Access Control ----
  role: {
    type: String,
    enum: ['reader', 'author', 'moderator', 'admin'],
    default: 'reader'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },

  // ---- Profile & Preferences ----
  bio: { type: String, maxlength: 1000 },
  avatarUrl: { type: String },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  preferences: {
    fontSize: { type: Number, default: 16 },
    readingMode: { type: String, enum: ['paged', 'scroll'], default: 'scroll' },
    language: { type: String, default: 'en' }
  },

  // ---- Social / Community ----
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
//   bookmarkedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],

  // ---- Authentication & Security ----
  refreshTokens: [String], // store active refresh tokens (for multi-device logins)
  lastLoginAt: { type: Date },
  loginHistory: [{
    ip: String,
    userAgent: String,
    loggedInAt: { type: Date, default: Date.now }
  }],
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date },

  // ---- Analytics & Audit ----
  
  lastActiveAt: { type: Date },
}, {
  timestamps: true, // auto-add createdAt, updatedAt
  versionKey: false // disable __v
});

module.exports = mongoose.model('User', userSchema);
