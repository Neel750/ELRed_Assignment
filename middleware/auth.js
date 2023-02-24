/** @format */

const jwt = require("jsonwebtoken");
const config = require("../config");

let validOTPs = [];
//TODO: returns a new JWT tokens
//param: userData that you want to encode as part of JWT token
exports.getJWTToken = async (id) => {
  let userData = {
    userid: id,
    tokenCreationDate: new Date().getTime().toString(),
  };
  let token = jwt.sign(userData, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
  return token;
};

//TODO: Middleware function to  check if request is having a valid JWT token
exports.verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      let result = jwt.verify(token, config.JWT_SECRET);
      request.id = result.userid;

      let now = new Date().getTime() / 1000; // Convert current time to seconds
      if (result.exp < now) {
        response.status(httpStatusCodes.UNAUTHORIZED).json({
          success: false,
          reason: "Your are required to login",
        });
      } else {
        next();
      }
    } catch (error) {
      response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        reason: "Something went wrong on server",
      });
      throw error();
    }
  } else {
    response.status(httpStatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: "Authentication Header is missing",
    });
  }
};

exports.addOTP = async (otp, email) => {
  validOTPs.push({ otp, email, time: new Date() });
};

exports.verifyOPT = async (otp, email) => {
  let obj = validOTPs.find((ele) => {
    let diff = new Date() - ele.time;
    let elapseTime = diff / (1 * 60 * 1000);

    if (elapseTime > 1) {
      validOTPs.splice(validOTPs.indexOf(ele), 1);
    } else {
      return ele.email === email && ele.otp === otp;
    }
  });
  if (obj) validOTPs.splice(validOTPs.indexOf(obj), 1);
  return obj;
};
