const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fathurpaoel41@gmail.com',
    pass: 'gydu buuf owzm vphk'
  }
});

module.exports = transporter;