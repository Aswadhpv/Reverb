const r = require('express').Router();
const a = require('../middleware/auth');
const c = require('../controllers/friendsController');
r.get('/', a, c.list);
r.post('/add',    a, c.add);
r.delete('/:id',  a, c.remove);
module.exports = r;
