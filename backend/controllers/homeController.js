exports.getHome = (req, res) => {
    res.json({
        welcome: `Welcome to Reverb, user ${req.user.id}!`,
        features: [
            'Real-time audio editing',
            'Collaborative sessions',
            'Chat + video integration',
            'AI-powered tools'
        ]
    });
};
