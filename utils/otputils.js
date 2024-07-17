const nodemailer = require('nodemailer');

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOtpEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    host: 'sg2plzcpnl491273.prod.sin2.secureserver.net', // Replace with your SMTP server
    port: 587, // Replace with your SMTP server port
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'contact@appmontize.co.in', // Replace with your email
      pass: 'Loginamd@321', // Replace with your email password
    },
  });

  let mailOptions = {
    from: '"Loki VPN " contact@appmontize.co.in', // sender address
    to: email, // list of receivers
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}`, // plain text body
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { generateOtp, sendOtpEmail };
