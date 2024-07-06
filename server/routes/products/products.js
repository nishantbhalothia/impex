

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../utils/sellerAuth');
const upload = require('../../utils/multer');

const productController = require('../../controllers/product/productsController');

router.post('/addNew', authMiddleware, upload.array('images', 5),   productController.createProduct);
router.get('/getAll', productController.getAllProducts);
router.get('/get/:id', productController.getProduct);
router.get('/getMultiple', productController.getProducts);
router.put('/update/:id', authMiddleware, productController.updateProduct);
router.delete('/delete/:id', authMiddleware, productController.deleteProduct);
router.get('/filter', productController.filterProducts);

// ================================= routes to handle product images========================================
router.post('/addImage', authMiddleware, upload.array('images', 5), productController.sample);  // sample route to test image upload
router.delete('/deleteImage/:id/:imageId', authMiddleware, productController.deleteImage);



module.exports = router;