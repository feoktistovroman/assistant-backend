const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const portfolioController = require('../controllers/portfolioController');

router.post('/portfolio', authenticate, portfolioController.createPortfolio);
router.get('/portfolio/:portfolioId', authenticate, portfolioController.getPortfolio);
router.get('/portfolios', authenticate, portfolioController.getPortfolios);
router.delete('/portfolio/:portfolioId', authenticate, portfolioController.deletePortfolio);
router.patch('/portfolio/:portfolioId', authenticate, portfolioController.updatePortfolio);

module.exports = router;
