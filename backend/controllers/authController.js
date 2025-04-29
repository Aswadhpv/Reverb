const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!email.match(/^\S+@\S+\.\S+$/) || password.length < 6)
        return res.status(400).json({ msg: 'Invalid input' });
    if (await User.findOne({ email }))
        return res.status(400).json({ msg: 'Email in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await new User({ username, email, password: hash }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username, email } });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ msg: 'Bad credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
};
