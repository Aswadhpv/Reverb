const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    const u = await User.findById(req.user.id).select('-password');
    res.json(u);
};

exports.updateProfile = async (req, res) => {
    const upd = {};
    if (req.body.username) upd.username = req.body.username;
    if (req.body.password) upd.password = await bcrypt.hash(req.body.password, 10);
    const u = await User.findByIdAndUpdate(req.user.id, upd, { new: true }).select('-password');
    res.json(u);
};
