const Session = require('../models/Session');
const axios = require('axios');
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
