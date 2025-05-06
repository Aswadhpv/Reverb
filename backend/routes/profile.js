const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/profileController');

r.get('/', authMiddleware, c.getProfile);
r.put('/', authMiddleware, c.updateProfile);

module.exports = r;
