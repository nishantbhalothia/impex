
const express = require('express');
const router = express.Router();

const userController = require('../../controllers/seller/sellerController');
const authMiddleware = require('../../utils/sellerAuth');

router.post('/register', userController.register);

router.post('/signin', userController.login);

// router.post('/forgot-password', userController.forgotPassword);

router.post('/logout', userController.logout);

router.get('/profile', [authMiddleware], userController.profile);

router.get('/products', [authMiddleware], userController.getProducts);


module.exports = router;