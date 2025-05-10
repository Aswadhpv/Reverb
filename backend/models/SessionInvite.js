const mongoose = require('mongoose');

const SessionInviteSchema = new mongoose.Schema({
    session:    { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    from:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:     { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('SessionInvite', SessionInviteSchema);
