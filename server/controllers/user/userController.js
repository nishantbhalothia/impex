const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email");

// =========================================================== register user ===========================================================
module.exports.register = async (req, res) => {
  console.log("userController_register req.body : ", req.body);
  const {
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    countryCode,
    role,
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

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password before saving the user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  if (!user) {
    User.create({
      username,
      email,
      phoneNumber,
      countryCode,
      password: hashedPassword,
      confirmPassword, // This is not required because we are already checking password and confirmPassword above and will not use it in production
      role,
    });
  }
  res.status(200).json({ message: "User registered successfully" });
};


// =========================================================== login user ===========================================================
module.exports.login = async (req, res) => {
  try {
    console.log("userController_login req.body : ", req.body);
    console.log("userController_login req.headers.cookie : ", req.headers.cookie);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
  
    // Check if username is a valid email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const phoneNumberRegex = /^(?:[0-9] ?){6,14}[0-9]$/.test(username);
  
    // Define the query condition based on whether username is an email or a phone number
    const query = isEmail ? { email: username } : { phoneNumber: username };
  
    const user = await User.findOne({ $or: [query] });
    console.log("userController_login user : ", user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
  
    const isPasswordMatch = await user.comparePassword(password);
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("ispasswordmatch_@userController : ", isPasswordMatch);
  
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("ispasswordmatch_@userController : ", isPasswordMatch);
    console.log("userController_login user : ", user);
  
    // const token = jwt.sign({ id: user._id }, process.env.AUTH_TOKEN_SECRET);
    const token = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();
    console.log("userController_login token : ", token);
  
    user.refreshToken = refreshToken;
    await user.save();
  
    // Send email alert for new login
    const options = {
      // email: user.email, // Uncomment this for production
      email: "nishantbhalothia4444@gmail.com", // Comment this for production
      subject: "Login Alert",
      message: `Hello ${user.username},\n\nYour account was just logged into from a new device. If this wasn't you, please contact us immediately.`,
    };
  
    // sendEmail(options); //Uncomment this to send email
    // const mailInfo = await sendEmail(options);
    // console.log("userController_login mailInfo : ", mailInfo.messageId);
  
    // Set cookies in the response for authTokenUser and refreshTokenUser
    res
      .cookie("authTokenUser", token, {
        maxAge: 60 * 1000, // 1 minute in milliseconds
        httpOnly: true,
        // secure: true, // Uncomment this for production to send cookie only over HTTPS
        // sameSite: 'strict' // Uncomment this for strict same-site policy
      })
      .cookie("refreshTokenUser", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        // secure: true, // Uncomment this for production to send cookie only over HTTPS
        // sameSite: 'strict' // Uncomment this for strict same-site policy
      });
  
    res
      .status(200)
      .header("auth-token", token)
      .json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
  } catch (error) {
    console.error("login ERROR console @userController", error);
  }
};

// =========================================================== forgot password ===========================================================
module.exports.forgotPassword = async (req, res) => {
  console.log("userController_forgotPassword req.body : ", req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please enter your email" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const token = jwt.sign({ id: user._id }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  console.log("userController_forgotPassword token : ", token);

  // Send email with reset password link
  const resetURL = `http://localhost:3000/reset-password/${token}`;
  const options = {
    email: user.email,
    subject: "Password Reset",
    message: `Hello ${user.username},\n\nPlease click on the link below to reset your password:\n\n${resetURL}`,
  };

  // sendEmail(options); //Uncomment this to send email in production
  // const mailInfo = await sendEmail(options); // Comment this for production beccause it will take time to send email and make the response slow
  // console.log("userController_forgotPassword mailInfo : ", mailInfo.messageId);

  res
    .status(200)
    .json({ message: "Password reset link has been sent to your email" });
};

// =========================================================== reset password ===========================================================
module.exports.resetPassword = async (req, res) => {
  console.log("userController_resetPassword req.body : ", req.body);
  const { password, confirmPassword } = req.body;
  const token = req.params.token;
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("reset password ERROR console", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =========================================================== logout user ===========================================================
module.exports.logout = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  user.refreshToken = "";
  await user.save();
  console.log("userController_logout req.body : ", req.body);
  console.log(
    "userController_logout req.headers.cookie : ",
    req.headers.cookie
  );
  if (!req.cookies.authTokenUser) {
    return res.status(400).json({ message: "User is already logged out" });
  }
  res.clearCookie("authTokenUser");
  res.status(200).json({ message: "Logged out successfully" });
  console.log("urer logged out successfully !");
};

// =========================================================== update user ===========================================================
module.exports.updateUser = async (req, res) => {
  console.log("userController_updateUser req.body : ", req.body);
  console.log(
    "userController_updateUser req.headers.cookie : ",
    req.headers.cookie
  );
  const {
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    countryCode,
    role,
  } = req.body;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneNumberRegex = /^(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);
  // remove spaces from phone number
  const phoneNumberWithoutSpaces = phoneNumberRegex.replace(/\s/g, "");

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const updatedUser = await User.findOneAndUpdate({ email }, req.body, {
    new: true,
  });

  res.status(200).json({ message: "User updated successfully", updatedUser });
};

// =========================================================== get user profile ===========================================================
module.exports.profile = async (req, res) => {
  console.log("userController_profile req.body : ", req.body);
  console.log(
    "userController_profile req.headers.cookie : ",
    req.headers.cookie
  );
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
};

// =========================================================== refresh token ===========================================================
module.exports.refreshToken = async (req, res) => {
  console.log("userController_refreshToken req.body : ", req.body);
  console.log(
    "userController_refreshToken req.headers.cookie : ",
    req.headers.cookie
  );
  const token =
    req.cookies.refreshTokenUser || req.headers.authorization.split(" ")[1];
  if (req.headers.authorization) {
    if (req.headers.authorization.split(" ")[0] !== "Bearer") {
      return res
        .status(400)
        .json({ message: "Invalid token due to not having Bearer token" });
    }
  }
  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  try {
    // Decoding the token to get the user _id
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    console.log("userController_refreshToken decoded : ", decoded);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Verify refresh token in the database with the one in the request
    const verityRefreshToken = user.refreshToken === token;
    if (!verityRefreshToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Generate new tokens and save the refresh token in the database
    const newToken = await user.generateAuthToken();
    const newRefreshToken = await user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set cookies in the response for authTokenUser and refreshTokenUser
    res
      .cookie("authTokenUser", token, {
        maxAge: 60 * 1000, // 1 minute in milliseconds
        httpOnly: true,
        // secure: true, // Uncomment this for production to send cookie only over HTTPS
        // sameSite: 'strict' // Uncomment this for strict same-site policy
      })
      .cookie("refreshTokenUser", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        // secure: true, // Uncomment this for production to send cookie only over HTTPS
        // sameSite: 'strict' // Uncomment this for strict same-site policy
      });

      res
      .status(200)
      .header("auth-token", token)
      .json({
        token: newToken,
        user: { // Send user details in the response and must be commented in production
          id: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
  } catch (error) {
    console.error("refresh token ERROR console", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

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
  const user = await User.findById(userID);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const { productId } = req.body;
  user.addClickedProduct(productId);
  res.status(200).json({ message: "Product clicked added successfully" });
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

// =========================================================== end of userController.js ===========================================================