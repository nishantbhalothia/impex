
const express = require('express');
const router = express.Router();

router.use('/users', require('./users/users'));
router.use('/sellers', require('./sellers/sellers'));
router.use('/products', require('./products/products'));

module.exports = router;