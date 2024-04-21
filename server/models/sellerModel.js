
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sellerSchema = new mongoose.Schema({
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
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'supplier', 'manufacturer', 'logistics', 'services'],
        default: 'user',
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    companyName: {
        // required: true,
        type: String,
    },
    address: {
        type: String,
    },
    companyAddress: {
        // required: true,
        type: String,
    },
    companyWebsite: {
        // required: true,
        type: String,
    },
    companyType: {
        // required: true,
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        expires: 600,
    },
    refreshToken: {
        type: String,
    },
    geoLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: {
            type: [[Number]],
            index: '2dsphere',
        },
    },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String },
        },
    ],
    

},{timestamps: true});



// Hash password before saving to DB
sellerSchema.pre('save', async function (next) {
    try {
        // if (!this.isModified('password')) {
        //     return next();
        // }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.confirmPassword = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

sellerSchema.pre('findByIdAndUpdate', async function (next) {
    try {
        if (!this.isModified('status')) {
            return next();
        }

        // any logic for future update
        next();
    } catch (error) {
        next(error);
    }
});

// Generate JWT
sellerSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id, email:this.email, name:this.name }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '4h' });
        return token;
    } catch (error) {
        console.error(error);
    }
};
sellerSchema.methods.generateRefreshToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        return token;
    } catch (error) {
        console.error(error);
    }
}

// Compare password
sellerSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        // console.log("comparePassword", isMatch);
        return isMatch;
    } catch (error) {
        console.error(error);
    }
};

// Verify JWT
sellerSchema.statics.verifyToken = async function (token) {
    try {
        const payload = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        return payload;
    } catch (error) {
        console.error(error);
    }
};

module.exports = mongoose.model('Seller', sellerSchema);



