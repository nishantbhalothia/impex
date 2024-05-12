

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../utils/sellerAuth');
const upload = require('../../utils/multer');

const productController = require('../../controllers/product/productsController');

router.post('/addNew', authMiddleware,  productController.createProduct);
router.get('/getAll', productController.getAllProducts);
router.get('/get/:id', productController.getProduct);
router.put('/update/:id', authMiddleware, productController.updateProduct);
router.delete('/delete/:id', authMiddleware, productController.deleteProduct);
router.get('/filter', productController.filterProducts);

// ================================= routes to handle product images========================================
router.post('/addImage/:id', authMiddleware, upload.single('images'), productController.sample);
router.delete('/deleteImage/:id/:imageId', authMiddleware, productController.deleteImage);



module.exports = router;