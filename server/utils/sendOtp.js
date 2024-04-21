
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;    
const client = new twilio(accountSid, authToken);

const sendOtp = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is ${otp} and is valid for 5 minutes. Do not share it with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log('OTP sent successfully:', message.sid);
    } catch (error) {
        console.error('sendOtp ERROR console:', error);
    }
};

module.exports = sendOtp;