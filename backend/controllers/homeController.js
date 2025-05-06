const User = require('../models/User');

exports.getHome = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');

        res.json({
            welcome: `Welcome to Reverb, ${user.username}!`,
            features: [
                {
                    title: 'Real-time Audio Editing',
                    description: 'Edit and mix tracks with your team live, from anywhere in the world.',
                    image: 'https://cdn-icons-png.flaticon.com/512/727/727218.png'
                },
                {
                    title: 'Collaborative Sessions',
                    description: 'Create or join music sessions with friends and bandmates.',
                    image: 'https://cdn-icons-png.flaticon.com/512/727/727245.png'
                },
                {
                    title: 'Chat & Video Integration',
                    description: 'Communicate with your team through integrated chat and video calls.',
                    image: 'https://cdn-icons-png.flaticon.com/512/1384/1384031.png'
                },
                {
                    title: 'AI-powered Tools',
                    description: 'Enhance your music with smart suggestions, auto-mixing, and mastering tools.',
                    image: 'https://cdn-icons-png.flaticon.com/512/599/599995.png'
                }
            ]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
