const transactionController = require("../controllers/transactionController");
const { transactionSchema } = require("../utils/validation");

exports.plugin = {
  name: "transactionRoutes",
  register: (server) => {
    server.route([
      {
        method: "GET",
        path: "/transactions",
        options: {
          auth: "jwt",
          description: "Get all transactions",
        },
        handler: transactionController.getTransactions,
      },
      {
        method: "POST",
        path: "/transactions",
        options: {
          auth: "jwt",
          description: "Add a new transaction",
        },
        handler: transactionController.createTransaction,
      },
      {
        method: "PUT",
        path: "/transactions/{id}",
        options: {
          auth: "jwt",
          description: "Update a transaction",
        },
        handler: transactionController.updateTransaction,
      },
      {
        method: "DELETE",
        path: "/transactions/{id}",
        options: {
          auth: "jwt",
          description: "Delete a transaction",
        },
        handler: transactionController.deleteTransaction,
      },
    ]);
  },
};
