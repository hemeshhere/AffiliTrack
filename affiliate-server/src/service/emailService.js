const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_ID,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const send = async (to, subject, body) => {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL_ID,
    to,
    subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = send;
