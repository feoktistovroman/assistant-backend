const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');

router.get('/dashboard', authenticate, userController.getDashboard);

module.exports = router;
