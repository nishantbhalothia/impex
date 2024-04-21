

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../utils/sellerAuth');
const productImageUpload = require('../../utils/multer');

const productController = require('../../controllers/product/productsController');

router.post('/addNew', authMiddleware, productImageUpload.array('images', 5), productController.createProduct);
router.get('/getAll', productController.getAllProducts);
router.get('/get/:id', productController.getProduct);
router.put('/update/:id', authMiddleware, productController.updateProduct);
router.delete('/delete/:id', authMiddleware, productController.deleteProduct);
router.get('/filter', productController.filterProducts);



module.exports = router;