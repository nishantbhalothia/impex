const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['home', 'office', 'billing', 'shipping', 'other'],
        default: 'home'
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
