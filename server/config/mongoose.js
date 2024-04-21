
const mongoose = require('mongoose');
// require('dotenv').config();

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        });
    } catch (error) {
        console.error('MongoDB connection failed');
        process.exit(1);
    }
};

module.exports = db;