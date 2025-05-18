const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

// GET profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// PUT profile with multipart/form-data
exports.updateProfile = async (req, res) => {
    try {
        const { username, password } = req.body;
        const updateData = {};

        if (username) {
            if (username.length < 3) {
                return res.status(400).json({ msg: "Username must be at least 3 characters" });
            }
            updateData.username = username;
        }

        if (password) {
            const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
            if (!strongPassword.test(password)) {
                return res.status(400).json({
                    msg: "Password must be 8+ characters, include uppercase, lowercase, number, and special character"
                });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Profile picture handling
        if (req.file) {
            const filename = req.file.filename;
            const filePath = `/uploads/profilePics/${filename}`;
            updateData.profilePic = filePath;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
