
const jwt = require('jsonwebtoken');



const authMiddleware = async (req, res, next) => {
    console.log('Auth middleware header:', req.headers.cookie);
    console.log('Auth middleware cookies:', req.cookies);
    const token = req.headers.authorization?req.headers.authorization.split(' ')[1] : null ||req.cookies['authTokenSeller'] ||req.headers?.cookie.split("=")[1] || req.body.token;
    console.log('Auth middlewarre Token:', token);
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    
    try {
        const user = await jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        req.user= user;
        console.log('User:', req.user);
        next();
    }

    catch (error) {
        console.error('auth middleware ERROR console',error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;

