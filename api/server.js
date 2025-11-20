const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ DB connection error:', err));

// import routes
const storyRoutes = require('./routes/stories');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chapterRoutes = require('./routes/chapters');
const reviewRoutes = require('./routes/review');
const commentRoutes = require('./routes/comment');

// use routes

app.use('/api/stories', storyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);

// test route

app.get('/', (req, res) => res.send('StoryLoom backend running.'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
