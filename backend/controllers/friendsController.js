const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

exports.sendRequest = async (req, res) => {
    const friend = await User.findOne({ email: req.body.email });
    if (!friend) return res.status(404).json({ msg: 'User not found' });

    const existing = await FriendRequest.findOne({ from: req.user.id, to: friend._id, status: 'pending' });
    if (existing) return res.status(400).json({ msg: 'Friend request already sent' });

    await FriendRequest.create({ from: req.user.id, to: friend._id });
    res.json({ msg: 'Friend request sent' });
};

exports.listRequests = async (req, res) => {
    const requests = await FriendRequest.find({ to: req.user.id, status: 'pending' })
        .populate('from', 'username email');
    res.json(requests);
};

exports.acceptRequest = async (req, res) => {
    const request = await FriendRequest.findById(req.params.id);
    console.log('Found request:', request);
    console.log('request.to:', request?.to?.toString());
    console.log('req.user.id:', req.user.id);

    if (!request || request.to.toString() !== req.user.id) {
        return res.status(404).json({ msg: 'Friend request not found or not authorized' });
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { friends: request.from } });
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: req.user.id } });

    res.json({ msg: 'Friend request accepted' });
};

exports.declineRequest = async (req, res) => {
    const request = await FriendRequest.findById(req.params.id);
    if (!request || request.to.toString() !== req.user.id) {
        return res.status(404).json({ msg: 'Friend request not found' });
    }

    request.status = 'declined';
    await request.save();
    res.json({ msg: 'Friend request declined' });
};

// Return the list of current friends
exports.list = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', 'username email');
        res.json(user.friends);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to list friends' });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.id;

        // Remove friend from both users
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

        res.json({ msg: 'Friend removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to remove friend' });
    }
};

