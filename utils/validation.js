const Joi = require("joi");

exports.userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("USER", "ADMIN").required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.transactionSchema = Joi.object({
  type: Joi.string().valid("INCOME", "EXPENSE").required(),
  amount: Joi.number().min(1).required(),
});
