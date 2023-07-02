const Portfolio = require('../models/portfolio');

exports.createPortfolio = async (req, res) => {
    try {
        const { title, goals, industries, preferences } = req.body;

        // Create new portfolio
        const portfolio = new Portfolio({
            user: req.userId,
            title,
            goals,
            industries,
            preferences,
        });

        // Save portfolio
        await portfolio.save();

        res.status(201).json({ message: 'Portfolio saved successfully', portfolioId: portfolio._id });
    } catch (error) {
        console.error('Error saving portfolio', error);
        res.status(500).json({ message: 'Failed to save portfolio' });
    }
};

exports.getPortfolio = async (req, res) => {
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
};

exports.getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ user: req.userId });
        res.json({ portfolios });
    } catch (error) {
        console.error('Error fetching portfolios', error);
        res.status(500).json({ message: 'Failed to fetch portfolios' });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        // Find portfolio by ID and user
        const portfolio = await Portfolio.findOneAndDelete({
            _id: portfolioId,
            user: req.userId,
        });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Error deleting portfolio', error);
        res.status(500).json({ message: 'Failed to delete portfolio' });
    }
};

exports.updatePortfolio = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        // Find portfolio by ID and user
        const portfolio = await Portfolio.findOneAndUpdate(
            {
                _id: portfolioId,
                user: req.userId,
            },
            { $set: req.body }, // Use $set operator to update only the provided fields
            { new: true }
        );

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({ message: 'Portfolio updated successfully', portfolio });
    } catch (error) {
        console.error('Error updating portfolio', error);
        res.status(500).json({ message: 'Failed to update portfolio' });
    }
};
