const r = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/collaborationController');

r.post('/session', authMiddleware, c.createSession);
r.post('/join',    authMiddleware, c.joinSession);
r.get('/plugins',  authMiddleware, c.listPlugins);
r.post('/process', authMiddleware, c.processAudio);

module.exports = r;
