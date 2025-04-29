const r = require('express').Router();
const a = require('../middleware/auth');
const c = require('../controllers/collaborationController');
r.post('/session',      a, c.createSession);
r.post('/join',         a, c.joinSession);
r.get('/plugins',       a, c.listPlugins);
r.post('/process',      a, c.processAudio);
module.exports = r;
