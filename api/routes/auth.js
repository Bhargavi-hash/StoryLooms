const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({ username, email, password: hashedPassword });
        console.log('Trying to register user:', username, email);
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
        console.log('✅ User registered:', username);
    } catch (err) {
        console.log('❌ User already exists. User registration failed:', err);
        res.status(400).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log('Login attempt for user:', username);
    // console.log('Login attempt password:', password);

    // Find user
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // console.log('User found:', user.username);
    // console.log('User password hash:', user.password);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('❌ Password mismatch');
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Password matched. Login successful for user:', user.username);
    res.json({ username, token });
});

// LOGOUT
router.post('/logout', (req, res) => {
    // ...clear cookie or invalidate refresh token

    res.json({ message: 'Logged out successfully' });
});

// REFRESH TOKEN
router.post('/refresh', (req, res) => {
    // ...issue new JWT using refresh token
});

module.exports = router;
