// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Portfolio schema
const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    goals: { type: String, required: true },
    industries: { type: String, required: true },
    risks: { type: String, required: true },
    preferences: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Middleware for authentication and authorization
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error('Error verifying token', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash and salt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userId = user._id;

        // Generate JWT
        const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/dashboard', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `Welcome, ${user.email}!` });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/portfolio', authenticateUser, async (req, res) => {
    try {
        const { title, goals, industries, risks, preferences } = req.body;

        // Create new portfolio
        const portfolio = new Portfolio({
            user: req.userId,
            title,
            goals,
            industries,
            risks,
            preferences,
        });

        // Save portfolio
        await portfolio.save();

        res.status(201).json({ message: 'Portfolio saved successfully' });
    } catch (error) {
        console.error('Error saving portfolio', error);
        res.status(500).json({ message: 'Failed to save portfolio' });
    }
});

// Get portfolio endpoint
app.get('/portfolio/:portfolioId', authenticateUser, async (req, res) => {
    try {
        const { portfolioId } = req.params;

        // Find portfolio by ID and user
        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            user: req.userId,
        });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({ portfolio });
    } catch (error) {
        console.error('Error fetching portfolio', error);
        res.status(500).json({ message: 'Failed to fetch portfolio' });
    }
});

// Fetch all portfolios for a user
app.get('/portfolios', authenticateUser, async (req, res) => { // New endpoint to fetch portfolios
    try {
        const portfolios = await Portfolio.find({ user: req.userId });
        res.json({ portfolios });
    } catch (error) {
        console.error('Error fetching portfolios', error);
        res.status(500).json({ message: 'Failed to fetch portfolios' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
