const Hapi = require("@hapi/hapi");
const db = require("./models");
const jwt = require("@hapi/jwt");
require("dotenv").config();

// Swagger packages
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Package = require("./package.json"); // To get info from package.json

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: "0.0.0.0", // Ensure it's accessible locally
    routes: {
      cors: {
        origin: ["*"], // Allow all origins
        headers: ["Accept", "Content-Type", "Authorization"], // Specify allowed headers
        exposedHeaders: ["Authorization"], // Specify exposed headers
        credentials: true, // Enable credentials (cookies, authorization headers)
      },
    },
  });

  // Register the JWT plugin
  await server.register(jwt);

  // Define the JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET, // Ensure you have the JWT_SECRET in your .env file
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: { id: artifacts.decoded.payload.id },
      };
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      exp: true,
    },
  });

  // Set default authentication strategy to 'jwt'
  server.auth.default("jwt");

  // Register plugins
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Finance Tracker API Documentation",
          version: Package.version,
        },
        grouping: "tags", // Group endpoints by tags
        tags: [
          { name: "user", description: "User related operations" },
          {
            name: "transaction",
            description: "Transaction related operations",
          },
        ],
      },
    },
  ]);

  // Register routes
  await server.register(require("./routes/userRoutes"));
  await server.register(require("./routes/transactionRoutes"));

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
