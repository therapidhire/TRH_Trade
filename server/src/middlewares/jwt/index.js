const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = (payload, options = {}) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      ...options,
    });
  } catch (error) {
    throw new Error(`Error signing token: ${error.message}`);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Error verifying token: ${error.message}`);
  }
};

module.exports = { signToken, verifyToken };
