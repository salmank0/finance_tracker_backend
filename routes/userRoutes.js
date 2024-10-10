const userController = require("../controllers/userController");
const { userSchema, loginSchema } = require("../utils/validation");

exports.plugin = {
  name: "userRoutes",
  register: (server) => {
    server.route([
      {
        method: "POST",
        path: "/register",
        options: {
          tags: ["api", "user"],
          auth: false,
          validate: {
            payload: userSchema,
            failAction: (request, h, err) => {
              // Return Joi validation error messages
              const errors = err.details.map((detail) => detail.message);
              return h
                .response({
                  status: false,
                  message: errors.join(", "),
                })
                .code(400)
                .takeover();
            },
          },
          description: "Register a new user",
          notes: "Creates a new user in the system",
        },
        handler: userController.register,
      },
      {
        method: "POST",
        path: "/login",
        options: {
          tags: ["api", "user"],
          auth: false,
          validate: {
            payload: loginSchema,
            failAction: (request, h, err) => {
              // Return Joi validation error messages
              const errors = err.details.map((detail) => detail.message);
              return h
                .response({
                  status: false,
                  message: errors.join(", "),
                })
                .code(400)
                .takeover();
            },
          },
          description: "User login",
          notes: "Generates a JWT token for the user",
        },
        handler: userController.login,
      },
      {
        method: "GET",
        path: "/user/me",
        options: {
          tags: ["api", "user"],
          auth: "jwt", // Ensure that only authenticated users can access this route
          description: "Get current user details",
          notes: "Returns details of the logged-in user",
        },
        handler: userController.getCurrentUser,
      },
    ]);
  },
};
