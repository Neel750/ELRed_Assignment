/** @format */

const mail = require("nodemailer");
const config = require("../config");
const transporter = mail.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASS,
  },
});

//OTP Sending Mail
exports.sendOTPMail = (data) => {
  var mailOptions = {
    from: config.EMAIL,
    to: data.toMail,
    //Subject
    subject: "Your OTP",
    //OTP in body
    html: `<p>${data.text}</p>`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);
      else return resolve(true);
    });
  });
};
