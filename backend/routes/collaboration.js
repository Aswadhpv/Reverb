const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const c = require('../controllers/collaborationController');
const multer = require('multer');

const upload = require('../utils/multerAudio');
const r = express.Router();

r.post('/session', authMiddleware, c.createSession);
r.post('/join', authMiddleware, c.joinSession);
r.get('/session/:id', authMiddleware, c.getSession);
r.get('/mySessions', authMiddleware, c.getMySessions);
r.delete('/session/:id', authMiddleware, c.deleteSession);
r.post('/session/:id/leave', authMiddleware, c.leaveSession);

r.get('/plugins', authMiddleware, c.listPlugins);
r.post('/process', authMiddleware, c.processAudio);

r.post('/upload', authMiddleware, upload.single('audio'), c.uploadAudio);
r.get('/files/:id/play', authMiddleware, c.playAudio);
r.get('/files/:id/download', authMiddleware, c.downloadFile);
r.put('/files/:id/rename', authMiddleware, c.renameFile);
r.get('/files', authMiddleware, c.getFiles);
r.post('/files/:id/save', authMiddleware, c.saveFileToLibrary);
r.patch('/files/:id/assign', authMiddleware, c.assignFileToSession);
r.post('/files/:id/saveCopy', authMiddleware, c.saveCopyToLibrary);
r.post('/files/:id/copyToSession', authMiddleware, c.copyFileToSession);
r.delete('/files/:id', authMiddleware, c.deleteFile);

r.post('/invite', authMiddleware, c.inviteFriend);
r.get('/invites', authMiddleware, c.listInvites);
r.post('/invites/:inviteId/accept', authMiddleware, c.acceptInvite);
r.post('/invites/:inviteId/reject', authMiddleware, c.rejectInvite);

module.exports = r;
