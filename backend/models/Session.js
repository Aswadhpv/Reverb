const mongoose = require('mongoose');
const SessionSchema = new mongoose.Schema({
    name: String,
    owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Session', SessionSchema);
