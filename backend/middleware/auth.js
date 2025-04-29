const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ msg: 'Unauthorized' });
    }
};
