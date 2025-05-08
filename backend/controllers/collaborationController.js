const Session = require('../models/Session');
const User = require('../models/User');
const File = require('../models/File');
const SessionInvite = require('../models/SessionInvite');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AUDIO = process.env.AUDIO_SERVICE_URL;

exports.createSession = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ msg: 'Session name is required' });

        const session = new Session({
            name,
            owner: req.user.id,
            participants: [req.user.id]
        });
        await session.save();
        res.status(200).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.joinSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        if (!session.participants.includes(req.user.id)) {
            session.participants.push(req.user.id);
            await session.save();
        }

        res.status(200).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        if (session.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only the session owner can delete it' });
        }

        await session.remove();
        res.status(200).json({ msg: 'Session closed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to delete session' });
    }
};

exports.listPlugins = async (req, res) => {
    try {
        const { data } = await axios.get(`${AUDIO}/plugins`);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch plugins' });
    }
};

exports.processAudio = async (req, res) => {
    try {
        const { data } = await axios.post(`${AUDIO}/process`, req.body, { responseType: 'arraybuffer' });
        res.set('Content-Type', 'audio/wav').send(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to process audio' });
    }
};

exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            user: req.user.id
        });
        await file.save();

        res.status(200).json({
            msg: 'File uploaded successfully',
            file: file.filename,
            path: `/uploads/${file.filename}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to upload file' });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find({ user: req.user.id });
        res.status(200).json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch files' });
    }
};

// --- Invite friend ---
exports.inviteFriend = async (req, res) => {
    try {
        const { sessionId, inviteeId } = req.body;
        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        // Ensure inviter is a participant
        if (!session.participants.includes(req.user.id))
            return res.status(403).json({ msg: 'Only participants can invite' });

        // Check if invite already exists
        const existing = await SessionInvite.findOne({ session: sessionId, to: inviteeId, status: 'pending' });
        if (existing) return res.status(409).json({ msg: 'Invite already sent' });

        const invite = new SessionInvite({
            from: req.user.id,
            to: inviteeId,
            session: sessionId
        });

        await invite.save();
        res.status(200).json({ msg: 'Invite sent', invite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to send invite' });
    }
};

// --- List invites ---
exports.listInvites = async (req, res) => {
    try {
        const invites = await SessionInvite.find({ to: req.user.id, status: 'pending' })
            .populate('from', 'username email')
            .populate('session', 'name');
        res.status(200).json(invites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch invites' });
    }
};

// --- Accept invite ---
exports.acceptInvite = async (req, res) => {
    try {
        const invite = await SessionInvite.findById(req.params.inviteId);
        if (!invite) return res.status(404).json({ msg: 'Invite not found' });
        if (invite.to.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not authorized to accept this invite' });

        // Add user to session participants
        const session = await Session.findById(invite.session);
        if (!session.participants.includes(req.user.id)) {
            session.participants.push(req.user.id);
            await session.save();
        }

        invite.status = 'accepted';
        await invite.save();

        res.status(200).json({ msg: 'Invite accepted', session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to accept invite' });
    }
};

// --- Reject invite ---
exports.rejectInvite = async (req, res) => {
    try {
        const invite = await SessionInvite.findById(req.params.inviteId);
        if (!invite) return res.status(404).json({ msg: 'Invite not found' });
        if (invite.to.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not authorized to reject this invite' });

        invite.status = 'rejected';
        await invite.save();

        res.status(200).json({ msg: 'Invite rejected' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to reject invite' });
    }
};
