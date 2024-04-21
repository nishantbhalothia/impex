
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
        enum: ['user', 'admin', 'supplier', 'manufacturer', 'logistics'],
        default: 'user',
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    address: {
        type: String,
    },
    verificationCode: {
        type: String,
        expires: 300, // 10 minutes
    },
    refreshToken: {
        type: String,
        expires: 604800, // 7 days
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
    

},{timestamps: true});



// Hash password before saving to DB
userSchema.pre('save', async function (next) {
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

userSchema.pre('findByIdAndUpdate', async function (next) {
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
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id, email:this.email, name:this.name }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1m'});
        return token;
    } catch (error) {
        console.error(error);
    }
};
userSchema.methods.generateRefreshToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        return token;
    } catch (error) {
        console.error(error);
    }
}

// Compare password
userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        // console.log("comparePassword", isMatch);
        return isMatch;
    } catch (error) {
        console.error(error);
    }
};

module.exports = mongoose.model('User', userSchema);



