const userController = require("../controllers/userController");
const { userSchema } = require("../utils/validation");

exports.plugin = {
  name: "userRoutes",
  register: (server) => {
    server.route([
      {
        method: "POST",
        path: "/register",
        options: {
          tags: ["api", "user"], // Add tags for Swagger documentation
          auth: false,
          validate: {
            payload: userSchema,
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
