const mongoose = require('mongoose');

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
    preferences: { type: String, required: false },
    calculator: {
        moneyToInvest: { type: Number, required: false },
        monthlyInvestment: { type: Number, required: false },
        riskLevel: { type: String, required: false },
        investmentYears: { type: Number, required: false },
    },
    stocks: [{
        ticker: { type: String, required: true },
        number: { type: Number, required: false },
        basePrice: { type: Number, required: false },
        percentage: { type: Number, required: false },
    }],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
