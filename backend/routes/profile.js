const r = require('express').Router();
const a = require('../middleware/auth');
const c = require('../controllers/profileController');
r.get('/', a, c.getProfile);
r.put('/', a, c.updateProfile);
module.exports = r;
