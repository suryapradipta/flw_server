
const jwt = require('jsonwebtoken');

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token not provided' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid refresh token' });
        req.user = user;
        next();
    });
};

module.exports = verifyRefreshToken;
