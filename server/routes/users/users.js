
const express = require('express');
const router = express.Router();

const {rateLimiter} = require('../../utils/rateLimiter');
const authMiddleware = require('../../utils/userAuth');
const userController = require('../../controllers/user/userController');

router.post('/register', userController.register);
router.post('/signin' ,userController.login);  // use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/logout', [rateLimiter,authMiddleware] ,userController.logout);
router.get('/profile', authMiddleware ,userController.profile);
router.post('/update', authMiddleware ,userController.updateUser);

// address routes
router.get('/addresses', authMiddleware ,userController.getAddresses);
router.post('/addresses', authMiddleware ,userController.addAddress);
router.put('/addresses/:addressId', authMiddleware ,userController.updateAddress);
router.delete('/addresses/:addressId', authMiddleware ,userController.deleteAddress);   // use rateLimiter in Production  , [rateLimiter, authMiddleware]   

// refresh token
router.post('/auth/refresh-token', userController.refreshToken);

// cart routes
router.get('/cart', authMiddleware ,userController.getCart);    // use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.post('/cart/:productId', authMiddleware ,userController.addToCart); // use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.delete('/cart/:productId', authMiddleware ,userController.removeFromCart); // use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.delete('/cart', authMiddleware ,userController.clearCart); // use rateLimiter in Production  , [rateLimiter, authMiddleware]

// wishlist routes
router.get('/wishlist', authMiddleware ,userController.getWishlist); // use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.post('/wishlist/:productId', authMiddleware, userController.addToWishlist);// use rateLimiter in Production  , [rateLimiter, authMiddleware]
router.delete('/wishlist/:productId', authMiddleware ,userController.removeFromWishlist); // use rateLimiter in Production  , [rateLimiter, authMiddleware]


module.exports = router;