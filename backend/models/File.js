const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalName: String,
    isFavorite: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    parentFile: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }, // 🔥 optional parent
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
