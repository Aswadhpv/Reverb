const Session = require('../models/Session');
const axios   = require('axios');
const AUDIO   = process.env.AUDIO_SERVICE_URL;

exports.createSession = async (req,res) => {
    const s = await new Session({
        name:req.body.name,
        owner:req.user.id,
        participants:[req.user.id]
    }).save();
    res.json(s);
};

exports.joinSession = async (req,res) => {
    const s = await Session.findByIdAndUpdate(
        req.body.sessionId,
        { $addToSet:{ participants:req.user.id } },
        { new:true }
    );
    res.json(s);
};

exports.listPlugins = async (req,res) => {
    const { data } = await axios.get(`${AUDIO}/plugins`);
    res.json(data);
};

exports.processAudio = async (req,res) => {
    const { data } = await axios.post(`${AUDIO}/process`, req.body, { responseType:'arraybuffer' });
    res.set('Content-Type','audio/wav').send(data);
};
