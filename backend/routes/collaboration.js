const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/collaborationController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const r = express.Router();

r.post('/session', authMiddleware, c.createSession);
r.post('/join', authMiddleware, c.joinSession);
r.delete('/session/:id', authMiddleware, c.deleteSession);
r.post('/session/:id/leave', authMiddleware, c.leaveSession);

r.get('/plugins', authMiddleware, c.listPlugins);
r.post('/process', authMiddleware, c.processAudio);

r.post('/upload', authMiddleware, upload.single('audio'), c.uploadAudio);
r.get('/files/:id/play', authMiddleware, c.playAudio);
r.get('/files/:id/download', authMiddleware, c.downloadFile);
r.get('/files', authMiddleware, c.getFiles);

r.post('/invite', authMiddleware, c.inviteFriend);
r.get('/invites', authMiddleware, c.listInvites);
r.post('/invites/:inviteId/accept', authMiddleware, c.acceptInvite);
r.post('/invites/:inviteId/reject', authMiddleware, c.rejectInvite);

module.exports = r;
