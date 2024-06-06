const mongoose = require("mongoose");

// Define a schema for product attributes
const productAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

// Define a schema for product images
const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    // required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

// Define a schema for product variations (if applicable)
const productVariationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  attributes: [productAttributeSchema],
});

// define a schema for product reviews
const productReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
});

// Define a schema for product promotions
const productPromotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

// Define a schema for paid promotions
const paidPromotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  visibility: {
    type: String,
    enum: ['all', 'prime', 'segmented'], // Visibility options
    default: 'all',
  },
  //products: [String], // Array of product IDs
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

// Define the main product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home & Kitchen",
        "Beauty & Personal Care",
        "Sports & Outdoors",
        "Toys & Games",
        "Others",
      ],
      type: String,
      required: true,
    },
    otherCategory: {
      type: String,
    },
    origin: {
      type: String,
    },
    isExpirable: {
      type: Boolean,
      default: false,
    },  // Default value is false
    expiryDate: {
      type: Date,
    },
    summary: {
      type: String,
    },
    specifications: {
      type: String,
    },
    priceRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    images: [productImageSchema],
    reviews: [productReviewSchema],
    promotions: [productPromotionSchema],
    paidPromotions: [paidPromotionSchema],
    //   attributes: [productAttributeSchema],
    //   variations: [productVariationSchema],
    packagingDimensions: {
      length: {
        type: Number,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
    weight: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    }, // Default quantity is 1
    moq: {
      type: Number,
      default: 1,
    }, // Default MOQ is 1
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      // required: true,
    },
  },
  { timestamps: true }
);

// Create a Mongoose model for the product schema
const Product = mongoose.model("Product", productSchema);
const Image = mongoose.model("Image", productImageSchema);

// Export the models
// module.exports = Product;
module.exports = { Product, Image };
