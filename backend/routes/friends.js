const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/friendsController');

r.get('/',        authMiddleware, c.list);
r.post('/add',    authMiddleware, c.add);
r.delete('/:id',  authMiddleware, c.remove);

module.exports = r;
