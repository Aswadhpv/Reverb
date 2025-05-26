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
        const populated = await Session.findById(session._id).populate('owner', 'username email');
        res.status(200).json(populated);
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

        const populated = await Session.findById(session._id).populate('owner', 'username email');
        res.status(200).json(populated);
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

exports.getSession = async (req, res) => {
    try {
        const sess = await Session.findById(req.params.id)
            .populate('owner', 'username email');
        if (!sess) return res.status(404).json({ msg: 'Session not found' });
        res.json(sess);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [
                { owner: req.user.id },
                { participants: req.user.id }
            ]
        }).populate('owner', 'username email');
        res.json(sessions);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Failed to fetch sessions' });
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

        // ✅ Validate access
        if (
            file.owner.toString() !== req.user.id &&
            (!file.session || !(await Session.findOne({
                _id: file.session,
                participants: req.user.id
            })))
        ) {
            return res.status(403).json({ msg: 'Not authorized to access this file' });
        }

        // ✅ Ensure cross-platform-safe path
        const absPath = path.join(__dirname, '..', file.path);
        const audioBuffer = fs.readFileSync(absPath).toString('latin1');

        // ✅ Call external audio service
        const { data } = await axios.post(`${AUDIO}/process`, {
            plugin,
            audio: audioBuffer
        }, { responseType: 'arraybuffer' });

        // ✅ Save processed file to disk and DB
        const filename = `${Date.now()}_${plugin}_${file.filename}.wav`;
        const relPath = `/uploads/audio/${filename}`;
        const absOut = path.join(__dirname, '..', 'uploads', 'audio', filename);

        fs.writeFileSync(absOut, Buffer.from(data));

        const processedFile = new File({
            filename,
            path: relPath,
            owner: req.user.id,
            session: file.session || undefined // optional link to session
        });

        await processedFile.save();

        res.status(200).json({
            msg: 'Audio processed and saved',
            file: processedFile.filename,
            path: relPath
        });

    } catch (err) {
        console.error('Failed to process audio:', err);
        res.status(500).json({ msg: 'Failed to process audio' });
    }
};


exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const relPath = `/uploads/audio/${req.file.filename}`;
        const sessionId = req.query.sessionId;

        const file = new File({
            filename: req.file.originalname,
            path: relPath,
            owner: req.user.id,
            ...(sessionId ? { session: sessionId } : {})
        });

        await file.save();

        res.status(200).json({ msg: 'File uploaded', file });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to upload file' });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });
        if (file.owner.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Forbidden' });

        const abs = path.join(__dirname, '..', file.path);       // turn relative => absolute
        if (!fs.existsSync(abs)) return res.status(404).json({ msg: 'Missing on disk' });

        // allow the browser (fetch) to read Content-Disposition
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

            // send the file with the real name
        res.download(abs, file.filename);   // (*download* helper sets headers for us)
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

        const mimeMap = { '.mp3':'audio/mpeg', '.wav':'audio/wav', '.ogg':'audio/ogg' };
        const ext = path.extname(file.filename).toLowerCase();
        res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
        fs.createReadStream(path.resolve(file.path)).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to play audio' });
    }
};

exports.renameFile = async (req, res) => {
    try {
        const { newName } = req.body;
        if (!newName?.trim()) return res.status(400).json({ msg: 'newName required' });

        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'Not found' });
        if (file.owner.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Forbidden' });

        const oldAbs = path.join(__dirname, '..', file.path);
        const oldExt = path.extname(file.filename);           // e.g. '.mp3'

        /* allow user to change ext if they typed one, else keep old */
        const desired = newName.includes('.') ? newName : newName + oldExt;
        const safe    = desired.replace(/[^a-z0-9_\-.]/gi, '_'); // very loose sanitation

        const newRel  = `/uploads/audio/${Date.now()}_${safe}`;
        const newAbs  = path.join(__dirname, '..', newRel);

        fs.renameSync(oldAbs, newAbs);

        file.filename = safe;
        file.path     = newRel;
        await file.save();

        res.json({ msg: 'Renamed', file });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Rename failed' });
    }
};

exports.saveFileToLibrary = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        if (file.owner.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not authorized to save this file' });

        file.isFavorite = true;
        await file.save();

        res.status(200).json({ msg: 'File saved to library', file });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to save file' });
    }
};

exports.assignFileToSession = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });
        if (file.owner.toString() !== req.user.id)
            return res.status(403).json({ msg: 'Not your file' });

        const session = await Session.findById(req.query.sessionId);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        // Check if user is a participant of that session
        if (!session.participants.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to attach to this session' });
        }

        file.session = session._id;
        await file.save();

        res.status(200).json({ msg: 'Attached file to session', file });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to assign file' });
    }
};

exports.saveCopyToLibrary = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        const relPath = `/uploads/audio/${Date.now()}_copy_${file.filename}`;
        const absSrc = path.join(__dirname, '..', file.path);
        const absDest = path.join(__dirname, '..', relPath);

        fs.copyFileSync(absSrc, absDest);

        const copy = new File({
            filename: file.filename,
            path: relPath,
            owner: req.user.id
        });

        await copy.save();
        res.status(200).json({ msg: 'Copied to library', file: copy });

    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Copy failed' });
    }
};

exports.copyFileToSession = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        const session = await Session.findById(req.query.sessionId);
        if (!session) return res.status(404).json({ msg: 'Session not found' });

        // Ensure user is participant
        if (!session.participants.includes(req.user.id)) {
            return res.status(403).json({ msg: 'You are not part of this session' });
        }

        const relPath = `/uploads/audio/${Date.now()}_sessionCopy_${file.filename}`;
        const absSrc = path.join(__dirname, '..', file.path);
        const absDest = path.join(__dirname, '..', relPath);

        fs.copyFileSync(absSrc, absDest);

        const copy = new File({
            filename: file.filename,
            path: relPath,
            owner: req.user.id,
            session: session._id
        });

        await copy.save();
        res.status(200).json({ msg: 'File copied to session', file: copy });

    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Failed to copy file to session' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        if (file.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete' });
        }

        // Delete physical file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        await File.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'File deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to delete file' });
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
            .populate({
                path: 'session',
                populate: {
                    path: 'owner',
                    select: 'username email'
                }
            });

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
