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

exports.leaveSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        if (session.owner.toString() === req.user.id) {
            return res.status(403).json({ msg: 'Owner cannot leave; must delete session instead' });
        }

        session.participants = session.participants.filter(id => id.toString() !== req.user.id);
        await session.save();

        res.status(200).json({ msg: 'You have left the session' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to leave session' });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        if (session.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only the session owner can delete it' });
        }

        await Session.findByIdAndDelete(session._id); // ✅ fixed line

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
        const { fileId, plugin } = req.body;

        if (!fileId || !plugin) {
            return res.status(400).json({ msg: 'fileId and plugin are required' });
        }

        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        // Validate access
        if (
            file.owner.toString() !== req.user.id &&
            (!file.session || !(await Session.findOne({
                _id: file.session,
                participants: req.user.id
            })))
        ) {
            return res.status(403).json({ msg: 'Not authorized to access this file' });
        }

        const audioBuffer = fs.readFileSync(file.path).toString('latin1');

        // Call audio-service
        const { data } = await axios.post(`${AUDIO}/process`, {
            plugin,
            audio: audioBuffer
        }, { responseType: 'arraybuffer' });

        // Save processed file
        const filename = `${Date.now()}_${plugin}_${file.filename}.wav`;
        const filepath = path.join('uploads', filename);
        fs.writeFileSync(filepath, Buffer.from(data));

        // Store in DB
        const processedFile = new File({
            filename: filename,
            path: filepath,
            owner: req.user.id,
            session: file.session || undefined // optional link to session
        });
        await processedFile.save();

        res.status(200).json({
            msg: 'Audio processed and saved',
            file: processedFile.filename,
            path: `/uploads/${processedFile.filename}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to process audio' });
    }
};

exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const sessionId = req.body.sessionId || req.query.sessionId;  // accept from body or query param

        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            owner: req.user.id,
            session: sessionId || undefined // optional
        });
        await file.save();

        res.status(200).json({
            msg: 'File uploaded successfully',
            file: file.filename,
            path: `/uploads/${file.filename}`,
            originalName: req.file.originalname,
            session: file.session
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to upload file' });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        // Authorization check
        if (file.session) {
            const session = await Session.findById(file.session);
            if (!session) return res.status(404).json({ msg: 'Session not found' });

            if (!session.participants.includes(req.user.id) && session.owner.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Not authorized to access this session file' });
            }
        } else if (file.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to access this file' });
        }

        // Determine file extension (default to .wav if unknown)
        const ext = path.extname(file.path) || '.wav';
        const downloadName = file.filename + ext;

        res.setHeader('Content-Type', 'audio/wav');  // force content type
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
        res.sendFile(path.resolve(file.path));
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to download file' });
    }
};

exports.playAudio = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        if (
            file.owner.toString() !== req.user.id &&
            (!file.session || !(await Session.findOne({ _id: file.session, participants: req.user.id })))
        ) {
            return res.status(403).json({ msg: 'Not authorized to access this file' });
        }

        const ext = path.extname(file.path);
        const contentType = ext === '.mp3' ? 'audio/mpeg' : 'audio/wav';

        res.setHeader('Content-Type', contentType);
        fs.createReadStream(path.resolve(file.path)).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to play audio' });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const query = {};

        if (req.query.sessionId) {
            // get files for the session
            const session = await Session.findById(req.query.sessionId);
            if (!session) return res.status(404).json({ msg: 'Session not found' });

            // check if user is participant
            if (!session.participants.includes(req.user.id) && session.owner.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Not authorized to view files for this session' });
            }

            query.session = req.query.sessionId;
        } else {
            // get user's personal files
            query.owner = req.user.id;
            query.session = { $exists: false };
        }

        const files = await File.find(query)
            .populate('owner', 'username email')
            .populate('session', 'name');

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
