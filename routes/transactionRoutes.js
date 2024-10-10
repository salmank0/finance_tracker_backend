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
          tags: ["api", "transaction"],
          description: "Get all transactions",
        },
        handler: transactionController.getTransactions,
      },
      {
        method: "POST",
        path: "/transactions",
        options: {
          auth: "jwt",
          tags: ["api", "transaction"],
          description: "Add a new transaction",
          validate: {
            payload: transactionSchema,
            failAction: (request, h, err) => {
              return h
                .response({ status: false, message: err.message })
                .code(400)
                .takeover();
            },
          },
        },
        handler: transactionController.createTransaction,
      },
      {
        method: "PUT",
        path: "/transactions/{id}",
        options: {
          auth: "jwt",
          tags: ["api", "transaction"],
          description: "Update a transaction",
          validate: {
            payload: transactionSchema,
            failAction: (request, h, err) => {
              return h
                .response({ status: false, message: err.message })
                .code(400)
                .takeover();
            },
          },
        },
        handler: transactionController.updateTransaction,
      },
      {
        method: "DELETE",
        path: "/transactions/{id}",
        options: {
          auth: "jwt",
          tags: ["api", "transaction"],
          description: "Delete a transaction",
        },
        handler: transactionController.deleteTransaction,
      },
    ]);
  },
};
