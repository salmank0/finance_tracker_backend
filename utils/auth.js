const jwt = require("@hapi/jwt");
require("dotenv").config();

exports.generateToken = (user) => {
  return jwt.token.generate(
    { id: user.id, email: user.email, role: user.role },
    { key: process.env.JWT_SECRET }
  );
};

exports.validateToken = (token) => {
  return jwt.token.decode(token).decoded.payload;
};
