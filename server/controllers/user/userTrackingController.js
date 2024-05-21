const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email");





// =========================================================== add search term ===========================================================
module.exports.addSearchTerm = async (req, res) => {
  console.log("userController_addSearchTerm req.body : ", req.body);
  console.log(
    "userController_addSearchTerm req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const { searchTerm } = req.body;

  const alreadySearched = user.searchHistory.find(
    (search) => search.searchTerm === searchTerm
  );

  if (alreadySearched) {
    // If product already searched, update the time and count
    alreadySearched.updatedAt = new Date();
    alreadySearched.count += 1;
    await user.save();
    
    console.log("Product already clicked, updated time");
    return res.status(200).json({ message: "Product click time updated successfully" });
  }

  user.addSearchTerm(searchTerm);
  res.status(200).json({ message: "Search term added successfully" });
}

// =========================================================== get search history ===========================================================
module.exports.getSearchHistory = async (req, res) => {
  console.log("userController_getSearchHistory req.body : ", req.body);
  console.log(
    "userController_getSearchHistory req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  res.status(200).json(user.searchHistory);
}

// =========================================================== get search history by ID ===========================================================
module.exports.getSearchHistoryById = async (req, res) => {
  console.log("userController_getSearchHistoryById req.body : ", req.body);
  console.log(
    "userController_getSearchHistoryById req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const searchID = req.params.id;
  const search = user.searchHistory.id(searchID);
  res.status(200).json(search);
}

// =========================================================== delete search history by ID ===========================================================
module.exports.deleteSearchHistoryById = async (req, res) => {
  console.log("userController_deleteSearchHistoryById req.body : ", req.body);
  console.log(
    "userController_deleteSearchHistoryById req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const searchID = req.params.id;
  user.searchHistory.id(searchID).remove();
  await user.save();
  res.status(200).json({ message: "Search history deleted successfully" });
}

// =========================================================== delete search history ===========================================================
module.exports.deleteSearchHistory = async (req, res) => {
  console.log("userController_deleteSearchHistory req.body : ", req.body);
  console.log(
    "userController_deleteSearchHistory req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  user.searchHistory = [];
  await user.save();
  res.status(200).json({ message: "Search history deleted successfully" });
}


// =========================================================== add watch history ===========================================================
module.exports.addWatchHistory = async (req, res) => {
  console.log("userController_addWatchHistory req.body : ", req.body);
  console.log(
    "userController_addWatchHistory req.headers.cookie : ",
    req.headers.cookie
  );
  
  const userID = req.user._id || req.body.userId;
  
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
  
    const { productId } = req.body;
  
    const clickedProduct = user.clickedProducts.find(
      (product) => product.productId.toString() === productId
    );
  
    if (clickedProduct) {
      // If product already clicked, update the time and count
      clickedProduct.updatedAt = new Date();
      clickedProduct.count += 1;
      await user.save();
      
      console.log("Product already clicked, updated time");
      return res.status(200).json({ message: "Product click time updated successfully" });
    }
  
    // If product not clicked, add a new entry
    user.clickedProducts.push({ productId });
    await user.save();
    
    console.log("Product clicked added successfully");
    res.status(200).json({ message: "Product clicked added successfully" });
  } catch (error) {
    console.error("Error in adding watch history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// =========================================================== get watch history ===========================================================
module.exports.getWatchHistory = async (req, res) => {
  console.log("userController_getWatchHistory req.body : ", req.body);
  console.log(
    "userController_getWatchHistory req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  res.status(200).json(user.clickedProducts);
}

// =========================================================== get watch history by ID ===========================================================
module.exports.getWatchHistoryById = async (req, res) => {
  console.log("userController_getWatchHistoryById req.body : ", req.body);
  console.log(
    "userController_getWatchHistoryById req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const productID = req.params.id;
  const product = user.clickedProducts.id(productID);
  res.status(200).json(product);
}

// =========================================================== delete watch history by ID ===========================================================
module.exports.deleteWatchHistoryById = async (req, res) => {
  console.log("userController_deleteWatchHistoryById req.body : ", req.body);
  console.log(
    "userController_deleteWatchHistoryById req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const productID = req.params.id;
  user.clickedProducts.id(productID).remove();
  await user.save();
  res.status(200).json({ message: "Watch history deleted successfully" });
}

// =========================================================== delete watch history ===========================================================
module.exports.deleteWatchHistory = async (req, res) => {
  console.log("userController_deleteWatchHistory req.body : ", req.body);
  console.log(
    "userController_deleteWatchHistory req.headers.cookie : ",
    req.headers.cookie
  );
  const userID = req.user._id || req.body.userId;
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  user.clickedProducts = [];
  await user.save();
  res.status(200).json({ message: "Watch history deleted successfully" });
}

// =========================================================== end of userTrackingController.js ===========================================================