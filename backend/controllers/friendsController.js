const User = require('../models/User');
exports.list = async (req, res) => {
    const me = await User.findById(req.user.id).populate('friends','username email');
    res.json(me.friends);
};
exports.add = async (req, res) => {
    const f = await User.findOne({ email: req.body.email });
    if (!f) return res.status(404).json({ msg:'Not found' });
    await User.findByIdAndUpdate(req.user.id,{ $addToSet:{ friends:f._id } });
    res.json({ msg:'Added' });
};
exports.remove = async (req, res) => {
    await User.findByIdAndUpdate(req.user.id,{ $pull:{ friends:req.params.id } });
    res.json({ msg:'Removed' });
};
