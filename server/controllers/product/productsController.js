const mongoose = require("mongoose");
const { Product, Image } = require("../../models/productModel");
const Seller = require("../../models/sellerModel");
const uploadImage = require("../../utils/cloudinary");

// ============================================ createProduct ============================================
module.exports.createProduct = async (req, res) => {
  console.log("Product addNew body @productsController", req.body);
  console.log("Product addNew files @productsController", req.files);

  const {
    name,
    description,
    maxPrice,
    minPrice,
    category,
    summary,
    quantity,
    specifications,
    length,
    width,
    height,
  } = req.body;

  if (
    !name ||
    !description ||
    !maxPrice ||
    !minPrice ||
    !category ||
    !quantity ||
    !specifications ||
    !length ||
    !width ||
    !height
  ) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  if (maxPrice < minPrice) {
    return res
      .status(400)
      .json({ message: "Max price cannot be less than min price" });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity cannot be less than 1" });
  }

  if (length < 0 || width < 0 || height < 0) {
    return res
      .status(400)
      .json({ message: "Dimensions cannot be negative or 0" });
  }

  const product = await Product.findOne({ name });
  if (product) {
    return res.status(400).json({ message: "Product already exists" });
  }

  // Get the seller details from the token in the request header and check if the seller exists
  const seller = req.user;
  console.log("Seller:", seller);
  const sellerDetails = await Seller.findById(seller._id);
  if (!sellerDetails) {
    console.log("Seller Details @productsController:", sellerDetails);
    return res.status(400).json({ message: "Login to your Seller Account" });
  }


  // Upload images to cloudinary
  const result = await Promise.all(
    req.files.map(async (file) => {
      const { path } = file; // Extracted path of the uploaded image file
      const uploadedImage = await uploadImage(path); // Upload image to cloudinary
      return uploadedImage;
    })
  );

  const imagesArray = result.map((image) => {
    return {
      url: image.url,
      altText: "Product Image",
    };
  });

  // const imagesArray = [];
  // if (req.files && req.files.length > 0) {
  //   req.files.forEach((file) => {
  //     const imageUrl = file.path; // Assuming file.path contains the URL/path to the uploaded image
  //     imagesArray.push({ url: imageUrl });
  //   });
  // }
  // if (imagesArray.length === 0) {
  //   return res.status(400).json({ message: "Please upload at least one image" });
  // }

  if (!product) {
    const newProduct = Product.create({
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
      images: imagesArray,
      specifications,
      packagingDimensions: {
        length,
        width,
        height,
      },
      seller: seller._id,
    });
    res.status(200).json({ message: "Product created successfully" });
  }
};

// ============================================ getAllProducts ============================================
// frontend will call this controller to fetch all products and provide the pageNumber and limit
module.exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 50; // Default limit to 10 documents per page
    const skipIndex = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find()
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ============================================ getProduct using _id ============================================
module.exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    // console.log('Product @producsController getProduct:', product);
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    
  }
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
    console.log('error in update product "productController"', error);
    res.status(400).json({ message: "Product not found" });
  }
};

// ============================================ deleteProduct ============================================
module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    // const objectId = new mongoose.Types.ObjectId(id);
    // product.deleteOne(objectId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log('error in delete product "productController"', error);
    res.status(400).json({ message: "Product not found" });
    
  }
};

// ============================================ filterProducts ============================================
module.exports.filterProducts = async (req, res) => {
  try {
    const { name, size, priceMin, priceMax, category, arrival, page } =
      req.query;
    const limit = 100; // Number of products per page
    const pageNumber = parseInt(page) || 1; // Current page number, default to 1 if not provided
    const skip = (pageNumber - 1) * limit; // Number of documents to skip based on page number

    let query = {};

    if (name) {
      query.name = name;
    }
    if (size) {
      query.size = size;
    }
    if (priceMin && priceMax) {
      query["priceRange.min"] = { $gte: parseInt(priceMin) };
      query["priceRange.max"] = { $lte: parseInt(priceMax) };
    } else if (priceMin) {
      query["priceRange.min"] = { $gte: parseInt(priceMin) };
    } else if (priceMax) {
      query["priceRange.max"] = { $lte: parseInt(priceMax) };
    }
    // Filter by arrival date latest of all products or arrival date of a specific product
    if (arrival) {
      if (arrival === "latest") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query.createdAt = { $gte: sevenDaysAgo };
      } else {
        query.arrival = arrival;
      }
    }
    if (category) {
      query.category = category;
    }

    console.log("filter product query:", query);

    // Fetch products with pagination
    const products = await Product.find(query).limit(limit).skip(skip);

    res.status(200).json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(products.length / limit),
    });
  } catch (error) {
    res.status(400).json({ message: "An error occurred" });
  }
};

//  ============================================ deleteImage ============================================
module.exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    console.log("deleteImage id and imageId:", id, imageId);
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found:", product);
      return res.status(400).json({ message: "Product not found" });
    }
    const image = product.images.id(imageId);
    if (!image) {
      console.log("Image not found:", image);
      return res.status(400).json({ message: "Image not found" });
    }
    await image.deleteOne();
    res.status(200).json({ message: "Image deleted successfully" });
    // const image = await Image.findById(imageId);
    // if (!image) {
    //   console.log("Image not found:", image);
    //   return res.status(400).json({ message: "Image not found" });
    // }
    // await image.deleteOne();
    // res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log("Error in deleteImage @productControllers", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};

//  ============================================ addImage ============================================
module.exports.addImage = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Error in addImage @productControllers", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};

//  ============================================ sample response ============================================
module.exports.sample = async (req, res) => {
  console.log("Sample route", req.body);
  console.log("Sample route @productControllers req.files", req.files);
  console.log("Sample route @productControllers req.file", req.file);
  res.status(200).json({ message: "Sample route", data: req.body });
};
