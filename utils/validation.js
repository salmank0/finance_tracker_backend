const Joi = require("joi");

exports.userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  phone: Joi.string().required().messages({
    "string.base": "Phone number must be a string",
    "string.min": "Phone number must be at least 10 characters long",
    "string.empty": "Phone number is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("USER", "ADMIN").required().messages({
    "any.only": "Role must be either USER or ADMIN",
    "string.empty": "Role is required",
  }),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
});

exports.transactionSchema = Joi.object({
  type: Joi.string().valid("INCOME", "EXPENSE").required().messages({
    "any.only": "Type must be either INCOME or EXPENSE",
    "string.empty": "Type is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than zero",
    "any.required": "Amount is required",
  }),
  userId: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "any.required": "User ID is required",
  }),
});
