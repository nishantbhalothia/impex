
const express = require('express');
const router = express.Router();

const {rateLimiter} = require('../../utils/rateLimiter');
const authMiddleware = require('../../utils/userAuth');
const userController = require('../../controllers/user/userController');

router.post('/register', userController.register);
router.post('/signin' ,userController.login);  // use rateLimiter in Production  , [rateLimiter]
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/logout', [rateLimiter,authMiddleware] ,userController.logout);
router.get('/profile', authMiddleware ,userController.profile);
router.post('/update', authMiddleware ,userController.updateUser);

// refresh token
router.post('/auth/refresh-token', userController.refreshToken);


module.exports = router;