const jwt = require('jsonwebtoken');

const refreshTokenMiddleware = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization');

    // Check if the token is present
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }

        // Attach the decoded user information to the request object
        req.user = user;
        next();
    });
};

module.exports = refreshTokenMiddleware;
