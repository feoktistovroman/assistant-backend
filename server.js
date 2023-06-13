const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const userRoutes = require('./routes/userRoutes');
const config = require('./config/config');

const app = express();
app.use(express.json());

mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

app.use(authRoutes);
app.use(portfolioRoutes);
app.use(userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
