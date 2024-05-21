
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


// user tracking routes
router.post('/search', authMiddleware ,userController.addSearchTerm);
router.get('/search', authMiddleware ,userController.getSearchHistory);
router.get('/search/:id', authMiddleware ,userController.getSearchHistoryById);
router.delete('/search/:id', authMiddleware ,userController.deleteSearchHistoryById);
router.delete('/search', authMiddleware ,userController.deleteSearchHistory);

// user tracking routes
router.post('/click', authMiddleware ,userController.addWatchHistory);
router.get('/click', authMiddleware ,userController.getWatchHistory);
router.get('/click/:id', authMiddleware ,userController.getWatchHistoryById);
router.delete('/click/:id', authMiddleware ,userController.deleteWatchHistoryById);
router.delete('/click', authMiddleware ,userController.deleteWatchHistory);



module.exports = router;