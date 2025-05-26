const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authenticate = require('../middleware/auth');

// Get active sessions for the authenticated user
router.get('/active', authenticate, async (req, res) => {
    try {
        const sessions = await Session.find({
            participants: req.user.id,
            isActive: true
        });
        res.json({ sessions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
