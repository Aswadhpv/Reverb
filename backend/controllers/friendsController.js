const User = require('../models/User');

exports.list = async (req, res) => {
    try {
        const me = await User.findById(req.user.id).populate('friends', 'username email');
        res.json(me.friends);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.add = async (req, res) => {
    try {
        const friend = await User.findOne({ email: req.body.email });
        if (!friend) return res.status(404).json({ msg: 'User not found' });
        if (friend._id.equals(req.user.id)) return res.status(400).json({ msg: 'Cannot add yourself' });

        const me = await User.findById(req.user.id);
        if (me.friends.includes(friend._id)) {
            return res.status(400).json({ msg: 'User already in friends list' });
        }

        me.friends.push(friend._id);
        await me.save();
        res.json({ msg: 'Friend added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.remove = async (req, res) => {
    try {
        const me = await User.findById(req.user.id);
        if (!me.friends.includes(req.params.id)) {
            return res.status(404).json({ msg: 'Friend not found in your list' });
        }

        me.friends.pull(req.params.id);
        await me.save();
        res.json({ msg: 'Friend removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
