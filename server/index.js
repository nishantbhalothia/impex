
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const {maxLimiter} = require('./utils/rateLimiter');
const port = process.env.PORT || 3000;

const app = express();
// app.use(cors({ origin:'http://localhost:3000', credentials: true}));
app.use(cors({ origin:true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
//app.use(maxLimiter);  // Apply rate limiter to all routes max 90 requests per minute  (uncomment in production)

// Import routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api', require('./routes/index'));

// Connect to MongoDB
db().then(() => {
  // Start the Express server after successful connection
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1); // Exit the process if MongoDB connection fails
});
