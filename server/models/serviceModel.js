const mongoose = require('mongoose');

// Define a schema for service attributes
const serviceAttributeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

// Define a schema for service images (if applicable)
const serviceImageSchema = new mongoose.Schema({
    url: { type: String, required: true }
});

// Define the main service schema
const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    summary: { type: String },
    price: { 
        amount: { type: Number },
        currency: { type: String } // You can further enhance this field for multi-currency support
    },
    attributes: [serviceAttributeSchema],
    images: [serviceImageSchema],
    ratings: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming a User schema
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }],
    // You can add more fields specific to services, such as duration, availability, etc.
}, { timestamps: true });

// Create a Mongoose model for the service schema
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
