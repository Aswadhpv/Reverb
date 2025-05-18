const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    email:    { type: String, unique: true },
    password: String,
    profilePic: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
