const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true }); // ✅ This enables both createdAt and updatedAt

module.exports = mongoose.model('Session', SessionSchema);
