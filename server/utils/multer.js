

// multerMiddleware.js
const multer = require('multer');

// Multer middleware for product images
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Define the upload directory for product images
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); // Define the filename
  },
});

const productImageUpload = multer({ storage: productImageStorage });

// Export the product image upload middleware for use in other files
module.exports = productImageUpload;
