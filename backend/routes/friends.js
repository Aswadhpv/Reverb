const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/friendsController');

r.post('/request', authMiddleware, c.sendRequest);
r.get('/requests', authMiddleware, c.listRequests);
r.post('/accept/:id', authMiddleware, c.acceptRequest);
r.post('/decline/:id', authMiddleware, c.declineRequest);
r.get('/', authMiddleware, c.list);  // existing list friends
r.delete('/:id', authMiddleware, c.removeFriend);

module.exports = r;
