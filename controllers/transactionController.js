const { Transaction } = require("../models");
const statusCodes = require("../utils/statusCodes");
const sendResponse = require("../utils/sendResponse");

exports.createTransaction = async (request, h) => {
  try {
    // Use userId from JWT token instead of the request payload
    const userId = request.auth.credentials.id;
    const { type, amount } = request.payload;

    // Create a transaction associated with the logged-in user
    const transaction = await Transaction.create({ type, amount, userId });

    return sendResponse(
      h,
      true,
      transaction,
      "Transaction created successfully",
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

exports.getTransactions = async (request, h) => {
  try {
    // Fetch transactions for the logged-in user only
    const userId = request.auth.credentials.id;
    const transactions = await Transaction.findAll({ where: { userId } });

    return sendResponse(
      h,
      true,
      transactions,
      "Transactions fetched successfully",
      statusCodes.OK
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

exports.updateTransaction = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const { id } = request.params;
    const { type, amount } = request.payload;

    // Find transaction belonging to the user
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return sendResponse(
        h,
        false,
        null,
        "Transaction not found or does not belong to the user",
        statusCodes.NOT_FOUND
      );
    }

    // Update transaction fields
    transaction.type = type;
    transaction.amount = amount;
    await transaction.save();

    return sendResponse(
      h,
      true,
      transaction,
      "Transaction updated successfully",
      statusCodes.OK
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

exports.deleteTransaction = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const { id } = request.params;

    // Find transaction belonging to the user
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return sendResponse(
        h,
        false,
        null,
        "Transaction not found or does not belong to the user",
        statusCodes.NOT_FOUND
      );
    }

    // Delete the transaction
    await transaction.destroy();

    return sendResponse(
      h,
      true,
      null,
      "Transaction deleted successfully",
      statusCodes.OK
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
