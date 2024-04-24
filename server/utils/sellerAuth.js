
const jwt = require('jsonwebtoken');



const authMiddleware = async (req, res, next) => {
    console.log('SellerAuth middleware header:', req.headers);
    console.log('SellerAuth middleware cookies:', req.cookies);

    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader?.split(' ')[1] : null ||req.cookies['authTokenSeller'] ||req.headers.cookie?.split("=")[1] || req.body.token;
    console.log('SellerAuth middleware Token:', token);

    // conditionally check if token is in the header and if it is a Bearer token 
    // if (authorizationHeader || authorizationHeader.startsWith('Bearer')) {
    //     return res.status(401).json({ message: 'Invalid token' });
    // }

    console.log('Seller Auth middlewarre Token:', token);
    if (!token) {
        return res.status(401).json({ message: 'Please LogIn Again' });
    }

    
    try {
        const user = await jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        req.user= user;
        console.log('User as seller:', req.user);
        next();
    }

    catch (error) {
        console.error('SellerAuth middleware ERROR console',error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;

