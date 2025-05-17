const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

exports.authMiddleware = async (req, res, next) => {
    const bearer = req.headers['authorization'];
    const token = bearer?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Authorization token missing" });

    // Check blacklist
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) return res.status(401).json({ msg: "Token has been blacklisted" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: "Invalid or expired token" });
    }
};
