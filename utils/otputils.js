const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOtpEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server
    port: process.env.SMTP_PORT, // SMTP server port
    secure: process.env.SMTP_PORT == 465, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // email
      pass: process.env.SMTP_PASS, // email password
    },
  });

  let mailOptions = {
    from: `"Loki VPN" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}`, // plain text body
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { generateOtp, sendOtpEmail };
