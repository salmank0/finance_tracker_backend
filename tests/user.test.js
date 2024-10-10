const request = require("supertest");
const Hapi = require("@hapi/hapi");
const { User } = require("../models"); // Mock Sequelize model
const bcrypt = require("bcryptjs"); // For password comparison
const Jwt = require("@hapi/jwt"); // Import the JWT library for registering JWT strategy
jest.mock("../models"); // Mock the models

describe("User API Endpoints", () => {
  let app;
  const secretKey = process.env.JWT_SECRET;

  beforeAll(async () => {
    app = new Hapi.Server({ port: 3001 });

    // Register JWT strategy
    await app.register(Jwt);
    app.auth.strategy("jwt", "jwt", {
      keys: {
        key: process.env.JWT_SECRET, // Use your JWT secret key
        algorithms: ["HS256"], // Specify the algorithms used for signing/verifying
      },
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
      },
      validate: async (artifacts, request, h) => {
        const user = await User.findByPk(artifacts.decoded.payload.id);
        if (!user) {
          return { isValid: false };
        }
        return { isValid: true };
      },
    });

    // Register only user routes without applying auth as default
    await app.register(require("../routes/userRoutes")); // Register routes
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Registration", () => {
    it("should register a user successfully", async () => {
      // Mock user creation in the database
      User.create.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "hashedPassword",
        role: "USER",
      });

      const res = await request(app.listener).post("/register").send({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
        role: "USER",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("user");
    });

    it("should fail registration with missing fields", async () => {
      const res = await request(app.listener).post("/register").send({
        email: "john@example.com",
        password: "password123",
        role: "USER",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('"name" is required');
    });
  });

  describe("User Login", () => {
    it("should log in a user successfully", async () => {
      // Mock user found in the database with hashed password
      const hashedPassword = await bcrypt.hash("password123", 10);

      User.findOne.mockResolvedValue({
        id: 1,
        email: "john@example.com",
        password: hashedPassword, // Mock hashed password
        validPassword: jest.fn().mockReturnValue(true),
      });

      // Mock bcrypt comparison to simulate correct password
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const res = await request(app.listener).post("/login").send({
        email: "john@example.com",
        password: "password123", // Plain password
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("token");
    });

    it("should fail login with incorrect password", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      User.findOne.mockResolvedValue({
        id: 1,
        email: "john@example.com",
        password: hashedPassword,
      });

      // Mock bcrypt comparison to simulate incorrect password
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      const res = await request(app.listener).post("/login").send({
        email: "john@example.com",
        password: "wrongpassword", // Incorrect password
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should fail login with non-existent email", async () => {
      // Mock user not found in the database
      User.findOne.mockResolvedValue(null);

      const res = await request(app.listener).post("/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should fail login with missing fields", async () => {
      const res = await request(app.listener).post("/login").send({
        email: "john@example.com",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBeDefined();
    });
  });

  describe("User Me Route (Requires Auth)", () => {
    it("should get the current user info", async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      // Mock finding the user based on token
      User.findByPk.mockResolvedValue(mockUser);

      // Generate a valid JWT token using the user's ID
      const token = Jwt.token.generate(
        { id: mockUser.id, email: mockUser.email },
        { key: secretKey, algorithm: "HS256" } // Use your JWT secret and algorithm
      );

      const res = await request(app.listener)
        .get("/user/me")
        .set("Authorization", `Bearer ${token}`); // Add valid auth header

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("email", "john@example.com");
    });
  });
});
