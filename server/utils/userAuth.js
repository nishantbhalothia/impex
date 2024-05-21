const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null || req.cookies['authTokenUser'] || req.headers?.cookie?.split("=")[1] || req.body.authTokenUser;

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    
    try {
        const user = await jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        req.user = user;
        console.log('User:', req.user);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired' });
        }
        console.error('auth middleware ERROR:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;
