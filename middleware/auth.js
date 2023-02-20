/** @format */

const jwt = require("jsonwebtoken");
const secretKey = "YQW8DNEqFKp1hCyiYRSF9WhhJeIs5Kka";
let tokenWhiteList = [];
let validOTPs = [];
//TODO: returns a new JWT tokens
//param: userData that you want to encode as part of JWT token
exports.getJWTToken = async (userData) => {
  let token = jwt.sign(userData, secretKey);
  if (tokenWhiteList.indexOf(token) === -1) tokenWhiteList.push(token);
  return token;
};

//TODO: Middleware function to  check if request is having a valid JWT token
exports.verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      if (tokenWhiteList.indexOf(token) !== -1) {
        let result = jwt.verify(token, secretKey);
        request.id = result;
        next();
      } else {
        response.removeHeader("Authorization");
        response.status(401).json({
          success: false,
          reason: "Your are required to login",
        });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        reason: "Something went wrong on server",
      });
      throw error();
    }
  } else {
    response.status(401).json({
      success: false,
      reason: "Authentication Header is missing",
    });
  }
};

exports.invalidate = async (request, response) => {
  let jwtToken = request.headers.authorization.split(" ")[1];
  let index = tokenWhiteList.indexOf(jwtToken);
  if (index !== -1) {
    response.removeHeader("Authorization");
    tokenWhiteList.splice(index, 1);
    return true;
  }
  return false;
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
