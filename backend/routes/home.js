const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const homeController = require('../controllers/homeController');

// Example public Home endpoint
r.get('/', (req, res) => {
    res.status(200).json({ msg: "Welcome to Reverb Home API!" });
});

// Example protected Home data (optional)
r.get('/features', authMiddleware, homeController.getHome);

module.exports = r;
