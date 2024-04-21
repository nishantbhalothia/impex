const rateLimit = require("express-rate-limit");

// Create the login limiter middleware
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again after 5 minutes",
});

// Create the max limiter middleware
const maxLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 90, // limit each IP to 90 requests per windowMs
  message: "Too many requests, please try again after 1 minute",
});

// Export both rate limiters as an object
module.exports = { maxLimiter, rateLimiter };
