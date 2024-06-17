const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Address = require("./userAddressSchema");

const searchHistorySchema = new mongoose.Schema(
  {
    searchTerm: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const clickedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      // required: true, // we will not store this in DB in production
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "supplier", "manufacturer", "logistics"],
      default: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    addresses:[ Address.schema ],
    verificationCode: {
      type: String,
      expires: 300, // 10 minutes
    },
    refreshToken: {
      type: String,
      expires: 604800, // 7 days
    },
    geoLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [[Number]],
        index: "2dsphere",
      },
    },
    searchHistory: [searchHistorySchema],
    clickedProducts: [clickedProductSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to DB
// userSchema.pre('save', async function (next) {
//     try {
// if (!this.isModified('password')) {
//     return next();
// }

// const salt = await bcrypt.genSalt(10);
// const hashedPassword = await bcrypt.hash(this.password, salt);
// this.password = hashedPassword;
// this.confirmPassword = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// userSchema.pre('findByIdAndUpdate', async function (next) {
//     try {
//         if (!this.isModified('status')) {
//             return next();
//         }

//         // any logic for future update
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Generate JWT
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id, email: this.email, name: this.name },
      process.env.AUTH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    return token;
  } catch (error) {
    console.error(error);
  }
};
userSchema.methods.generateRefreshToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    console.error(error);
  }
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log("comparePassword @userModel.js", isMatch);
    return isMatch;
  } catch (error) {
    console.error(error);
  }
};



// Add a search term to the user's search history
userSchema.methods.addSearchTerm = async function (searchTerm) {
    this.searchHistory.push({ searchTerm });
    await this.save();
  };
  
  // Add a clicked product to the user's clicked products
  userSchema.methods.addClickedProduct = async function (productId) {
    this.clickedProducts.push({ productId });
    await this.save();
  };

// add address to user
userSchema.methods.addAddress = async function (address) {
  this.address.push(address);
  await this.save();
};



module.exports = mongoose.model("User", userSchema);
