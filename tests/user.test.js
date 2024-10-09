const request = require("supertest");
const Hapi = require("@hapi/hapi");
const { User } = require("../models"); // Mock Sequelize model
const server = require("../server"); // Your HapiJS server
jest.mock("../models"); // Mock the models

describe("User API Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = new Hapi.Server({ port: 3000 });
    await app.register(require("../routes/userRoutes")); // Register routes
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  // Mock user creation in the database
  User.create.mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
    role: "user",
  });

  // Test registration
  it("should register a user", async () => {
    const res = await request(app.listener).post("/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("user");
  });

  // Mock user login
  User.findOne.mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
    role: "user",
  });

  it("should log in a user", async () => {
    const res = await request(app.listener).post("/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });
});
