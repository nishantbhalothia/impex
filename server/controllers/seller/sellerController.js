const Seller = require("../../models/sellerModel");
const Products = require("../../models/productModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  console.log(req.body);
  const {
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    countryCode,
    role,
    companyAddress,
    companyName,
    companyWebsite,
    companyType,
  } = req.body;
  if (!username || !email || !password || !phoneNumber || !confirmPassword) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneNumberRegex = /^(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);

  if (!isEmail || !phoneNumberRegex) {
    return res.status(400).json({ message: "Invalid email or phone number" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await Seller.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!user) {
    Seller.create({
      username,
      email,
      phoneNumber,
      countryCode,
      password,
      confirmPassword,
      role,
      companyAddress,
      companyName,
      companyWebsite,
      companyType,
    });
  }
  res.status(200).json({ message: "Account registered successfully" });
};

module.exports.login = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Check if username is a valid email
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const phoneNumberRegex = /^(?:[0-9] ?){6,14}[0-9]$/.test(username);

  // Define the query condition based on whether username is an email or a phone number
  const query = isEmail ? { email: username } : { phoneNumber: username };

  const user = await Seller.findOne({ $or: [query] });
  if (!user) {
    return res.status(400).json({ message: "Seller does not exist" });
  }

  const isPasswordMatch = user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  console.log("ispasswordmatch_Seller : ", isPasswordMatch);
  console.log("sellerController_login user : ", user);

  const token = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET);
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log("sellerController_login token : ", token);

  // Set cookie in the response
  res.cookie("authTokenSeller", token, {
    maxAge: 86400 * 1000, // 24 hours in milliseconds
    httpOnly: true,
    // secure: true, // Uncomment this for production to send cookie only over HTTPS
    // sameSite: 'strict' // Uncomment this for strict same-site policy
  });
  res.cookie("refreshTokenSeller", refreshToken, {
    maxAge: 86400 * 1000, // 24 hours in milliseconds
    httpOnly: true,
    // secure: true, // Uncomment this for production to send cookie only over HTTPS
    // sameSite: 'strict' // Uncomment this for strict same-site policy
  });

  res.status(200).json({
    authTokenSeller: token,
    refreshTokenSeller: refreshToken,
    //remove user password from response in production
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
};

module.exports.logout = async (req, res) => {
  // Clear the cookie in the response
  res.clearCookie("authTokenSeller");
  res.clearCookie("refreshTokenSeller");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.profile = async (req, res) => {
  // we will get the user from the auth middleware
  const user = await Seller.findById(req.user._id).select("-password");
  const products = await Products.find({ seller: req.user._id });
  res
    .status(200)
    .json({ 
      user, 
      products, 
      message: "Profile fetched successfully" ,
    });
};


module.exports.getProducts = async (req, res) => {
  const products = await Products.find({ seller: req.user._id });
  res
  .status(200)
  .json({ products, message: "Products fetched successfully" });
};