const mongoose = require("mongoose");
const {Product, Image} = require("../../models/productModel");
const Seller = require("../../models/sellerModel");

module.exports.createProduct = async (req, res) => {
  console.log('Product addNew body @productsController',req.body);
  console.log('Product addNew files @productsController',req.files);
  const {
    name,
    description,
    maxPrice,
    minPrice,
    category,
    summary,
    quantity,
    // imageUrl,
    images,
    specifications,
    length,
    width,
    height,
  } = req.body;
  if (!name || !description || !maxPrice || !minPrice || !category || !quantity || !images || !specifications || !length || !width || !height) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  if (maxPrice < minPrice) {
    return res.status(400).json({ message: "Max price cannot be less than min price" });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity cannot be less than 1" });
  }

  if (length < 0 || width < 0 || height < 0) {
    return res.status(400).json({ message: "Dimensions cannot be negative or 0" });
  }

  const product = await Product.findOne({ name });
  if (product) {
    return res.status(400).json({ message: "Product already exists" });
  }

// Get the seller details from the token in the request header and check if the seller exists
  const seller = req.user
  console.log('Seller:', seller);
  const sellerDetails = await Seller.findById(seller._id);
  if (!sellerDetails) {
    console.log('Seller Details:', sellerDetails);
    return res.status(400).json({ message: "Login to your Seller Account" });
  }

  if (!product) {
    const newProduct = Product.create(
      {
        name,
        description,
        priceRange: {
          min: minPrice,
          max: maxPrice,
        },
        category,
        otherCategory: req.body.otherCategory,
        origin: req.body.origin,
        isExpirable: req.body.isExpirable,
        expiryDate: req.body.expiryDate,
        brandName: req.body.brandName,
        manufacturer: req.body.manufacturer,
        summary,
        quantity,
        images: [...images],
        specifications,
        packagingDimensions: {
          length,
          width,
          height,
        },
        seller: seller._id,
      }
    )
    res.status(200).json({ message: "Product created successfully" });
  }
};

// ============================================ getAllProducts ============================================
module.exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  // console.log('All Products:', products); 
  res.status(200).json({ products });
};

// ============================================ getProduct ============================================
module.exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }
  // console.log('Product @producsController getProduct:', product);
  res.status(200).json({ product });
};

// ============================================ updateProduct ============================================
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
    
  } catch (error) {
    console.log('error in update product "productController"',error);
    res.status(400).json({ message: "Product not found" });
    
  }
};

// ============================================ deleteProduct ============================================
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }
  // const objectId = new mongoose.Types.ObjectId(id);
  // product.deleteOne(objectId);
  res.status(200).json({ message: "Product deleted successfully" });
};

// ============================================ filterProducts ============================================
module.exports.filterProducts = async (req, res) => {
  try {
    const { name, size, priceMin, priceMax, category } = req.query;
    let query = {};
    if (name) {
      query.name = name;
    }
    if (size) {
      query.size = size;
    }
    // if (priceMin && priceMax) {
    //   query.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
    // } else if (priceMin) {
    //   query.price = { $gte: parseInt(priceMin) };
    // } else if (priceMax) {
    //   query.price = { $lte: parseInt(priceMax) };
    // }
    if (priceMin && priceMax) {
      query['priceRange.min'] = { $gte: parseInt(priceMin) };
      query['priceRange.max'] = { $lte: parseInt(priceMax) };
    } else if (priceMin) {
      query['priceRange.min'] = { $gte: parseInt(priceMin) };
    } else if (priceMax) {
      query['priceRange.max'] = { $lte: parseInt(priceMax) };
    }
    if (category) {
      query.category = category;
    }
    console.log('filter product query:', query);
    const products = await Product.find(query);
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ message: "An error occurred" });

    
  }
}


//  ============================================ deleteImage ============================================
module.exports.deleteImage = async (req, res) => {
  const { id, imageId } = req.params;
  console.log('deleteImage id and imageId:', id, imageId);
  const product = await Product.findById(id);
  if (!product) {
    console.log('Product not found:', product);
    return res.status(400).json({ message: "Product not found" });
  }
  const image = await Image.findById(imageId);
  if (!image) {
    console.log('Image not found:', image);
    return res.status(400).json({ message: "Image not found" });
  }
  await image.deleteOne();
  res.status(200).json({ message: "Image deleted successfully" });
};


//  ============================================ addImage ============================================
module.exports.addImage = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }
  const newImage = await Image.create({
    path: req.file.path,
    // productId: id,
  });
  res.status(200).json({ message: "Image added successfully" });
}


//  ============================================ sample response ============================================
module.exports.sample = async (req, res) => {
  res.status(200).json({ message: "Sample route" });
}