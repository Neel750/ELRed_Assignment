/** @format */

const { getJWTToken, addOTP, verifyOPT } = require("../middleware/auth");
const userModel = require("../models/userModel");
const { sendOTPMail } = require("../utilities/mail");

//TODO: Login user and send JWT token as cookie naed:AuthToken in response on successful login
//request parameters:email, password
exports.login = async (request, response) => {
  const { email, password } = request.body;
  let user = await userModel.find({
    email: email,
    password: password,
    emailVerified: 1,
  });
  if (user && user.length > 0) {
    let token = await getJWTToken(user[0].id);
    response.status(200).json({
      success: true,
      reason: "login successful",
      token: token,
    });
  } else {
    response.status(401).json({
      success: false,
      reason: "Login Failed: Invalid Email or Password",
    });
  }
};

//TODO: Register a new User
//Request Params: expects email, name, password
exports.signUp = async (request, response) => {
  const { email, name, password } = request.body;

  if (email && name && password) {
    let result = await userModel.create({
      name: name,
      email: email,
      password: password,
    });
    if (result) {
      let otp = Math.random().toFixed(6).substring(2, 8);
      addOTP(otp, email);
      let data = {
        toMail: email,
        text: `OTP for recovering your account is:<b>${otp}</b>.<br>OTP is valid for 15mins`,
      };
      sendOTPMail(data);
      response.status(200).json({
        success: true,
        reason: "OTP is send to entered email",
      });
    } else {
      // fs.unlink(request.file.path, (err) => { if (err) console.log(err) })
      response.status(200).json({
        success: false,
        reason: "User registration failed",
      });
    }
  } else {
    // fs.unlink(request.file.path, (err) => { if (err) console.log(err) })
    response.status(200).json({
      success: false,
      reason: "Requires name, email and password as part of request body",
    });
  }
};

exports.verifyOTP = async (request, response) => {
  let { otp, email } = request.body;

  if (otp && email) {
    let result = await verifyOPT(otp, email);
    if (result) {
      result = await userModel.findOneAndUpdate(
        { email: email },
        { emailVerified: 1 },
        {
          useFindAndModify: false,
        }
      );
      response.status(200).json({
        success: true,
        reason: "OTP is verified",
      });
    } else {
      response.status(200).json({
        success: false,
        reason: "OPT verification has failed",
      });
    }
  } else {
    response.status(200).json({
      success: false,
      reason: "Request Params Missing: otp and email in request body",
    });
  }
};
