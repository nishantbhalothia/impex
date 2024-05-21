
const express = require('express');
const router = express.Router();

router.use('/users', require('./users/users'));
router.use('/sellers', require('./sellers/sellers'));
router.use('/products', require('./products/products'));
router.use('/user-tracking', require('./users/userTracking'));

module.exports = router;