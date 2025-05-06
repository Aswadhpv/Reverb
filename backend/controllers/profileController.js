const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, password } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ msg: "Password must be at least 8 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
