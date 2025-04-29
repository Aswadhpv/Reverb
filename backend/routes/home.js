const r = require('express').Router();
const a = require('../middleware/auth');
const c = require('../controllers/homeController');
r.get('/', a, c.getHome);
module.exports = r;
