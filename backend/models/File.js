const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
