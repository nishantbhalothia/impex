const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Admin <`process.env.EMAIL_FROM`>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: <h1>HTML goes here</h1>
    };

    // 3) Actually send the email
    const  info = await transporter.sendMail(mailOptions);
    // return info;  // Uncomment this line to see the response from the email service
};

module.exports = sendEmail;