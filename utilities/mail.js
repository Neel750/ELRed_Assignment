/** @format */

const mail = require("nodemailer");
const transporter = mail.createTransport({
  service: "gmail",
  auth: {
    user: "170010116050@adit.ac.in",
    pass: "Neel.it@50",
  },
});

//OTP Sending Mail
exports.sendOTPMail = (data) => {
  var mailOptions = {
    from: "170010116050@adit.ac.in",
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
