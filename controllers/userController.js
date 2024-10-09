const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/auth");
const statusCodes = require("../utils/statusCodes");
const sendResponse = require("../utils/sendResponse");

exports.register = async (request, h) => {
  try {
    const { name, email, phone, password } = request.payload;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendResponse(
        h,
        false,
        null,
        "User already exists",
        statusCodes.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "USER",
    });
    const token = generateToken(user);

    return sendResponse(
      h,
      true,
      { user, token },
      "User registered successfully",
      statusCodes.CREATED
    );
  } catch (error) {
    console.log(error);
    return sendResponse(
      h,
      false,
      null,
      "Internal server error",
      statusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

exports.login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendResponse(
        h,
        false,
        null,
        "Invalid email or password",
        statusCodes.UNAUTHORIZED
      );
    }

    const token = generateToken(user);
    return sendResponse(h, true, { token }, "Login successful", statusCodes.OK);
  } catch (error) {
    console.log(error);
    return sendResponse(
      h,
      false,
      null,
      "Internal server error",
      statusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getCurrentUser = async (request, h) => {
  try {
    const user = await User.findByPk(request.auth.credentials.id, {
      attributes: { exclude: ["password"] }, // Exclude the password from the returned data
    });

    if (!user) {
      return sendResponse(
        h,
        true,
        transaction,
        "User not found!",
        statusCodes.NOT_FOUND
      );
    }

    return sendResponse(h, true, user, "User found", statusCodes.OK);
  } catch (error) {
    console.log(error);
    return sendResponse(
      h,
      true,
      null,
      "Internal server error",
      statusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
