const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define email options
  const mailOptions = {
    from: "Rudraksh Khandelwal <test1@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :
  };
  //Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
