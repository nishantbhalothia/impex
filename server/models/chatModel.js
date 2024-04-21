const mongoose = require('mongoose');

// Define a schema for different types of messages
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who sent the message
    content: { type: String }, // For text messages
    imageUrl: { type: String }, // For image messages
    pdfUrl: { type: String }, // For PDF messages
    videoUrl: { type: String }, // For video messages
});

// Define the main chat schema
const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Reference to the Seller
    messages: [messageSchema]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps to the document

// Create a Mongoose model for the chat schema
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
