const request = require("supertest");
const Hapi = require("@hapi/hapi");
const { Transaction } = require("../models"); // Mock Sequelize model
const Jwt = require("@hapi/jwt"); // For JWT token generation
const { User } = require("../models"); // Mock the user model to simulate logged-in user
jest.mock("../models");

describe("Transaction API Endpoints", () => {
  let app;
  const secretKey = process.env.JWT_SECRET; // Use your JWT secret key
  let token;

  beforeAll(async () => {
    app = new Hapi.Server({ port: 3002 });

    // Register JWT strategy
    await app.register(Jwt);
    app.auth.strategy("jwt", "jwt", {
      keys: {
        key: secretKey,
        algorithms: ["HS256"],
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

    await app.register(require("../routes/transactionRoutes")); // Register routes
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock user and generate a valid token for tests
    const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
    User.findByPk.mockResolvedValue(mockUser); // Mock user for JWT validation

    // Generate a valid JWT token
    token = Jwt.token.generate(
      { id: mockUser.id, email: mockUser.email },
      { key: secretKey, algorithm: "HS256" }
    );
  });

  describe("Create Transaction", () => {
    it("should create a transaction successfully", async () => {
      Transaction.create.mockResolvedValue({
        id: 1,
        type: "INCOME",
        amount: 1000,
        userId: 1,
      });

      const res = await request(app.listener)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "INCOME",
          amount: 1000,
          userId: 1,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });

    it("should fail to create a transaction with missing fields", async () => {
      const res = await request(app.listener)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 1000, // Missing the 'type' field
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('"type" is required');
    });

    it("should fail to create a transaction with invalid type", async () => {
      const res = await request(app.listener)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "INVALID", // Invalid type
          amount: 1000,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Type must be either INCOME or EXPENSE");
    });

    it("should fail to create a transaction with negative amount", async () => {
      const res = await request(app.listener)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "EXPENSE",
          amount: -500, // Invalid negative amount
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Amount must be greater than zero");
    });

    it("should fail to create a transaction without authentication", async () => {
      const res = await request(app.listener).post("/transactions").send({
        type: "INCOME",
        amount: 1000,
      });

      expect(res.statusCode).toEqual(401); // Authentication failure should return 401
      expect(res.body).toEqual(
        expect.objectContaining({
          error: expect.any(String), // Expect status to be defined
          message: expect.any(String), // Expect a message to be defined
        })
      );
    });
  });

  describe("Fetch Transactions", () => {
    it("should fetch all transactions for the authenticated user", async () => {
      Transaction.findAll.mockResolvedValue([
        {
          id: 1,
          type: "INCOME",
          amount: 1000,
          userId: 1,
        },
      ]);

      const res = await request(app.listener)
        .get("/transactions")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should fail to fetch transactions without authentication", async () => {
      const res = await request(app.listener).get("/transactions");

      expect(res.statusCode).toEqual(401); // Authentication failure should return 401
      expect(res.body).toEqual(
        expect.objectContaining({
          error: expect.any(String), // Expect status to be defined
          message: expect.any(String), // Expect a message to be defined
        })
      );
    });
  });

  describe("Update Transaction", () => {
    it("should update a transaction successfully", async () => {
      const mockTransaction = {
        id: 1,
        type: "INCOME",
        amount: 1000,
        userId: 1,
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock finding the transaction
      Transaction.findOne.mockResolvedValue(mockTransaction);

      const res = await request(app.listener)
        .put("/transactions/1")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "EXPENSE",
          amount: 500,
          userId: 1,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.type).toBe("EXPENSE");
      expect(res.body.data.amount).toBe(500);
    });

    it("should fail to update a transaction that does not exist", async () => {
      // Mock transaction not found
      Transaction.findOne.mockResolvedValue(null);

      const res = await request(app.listener)
        .put("/transactions/999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "EXPENSE",
          amount: 500,
          userId: 1,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Transaction not found or does not belong to the user"
      );
    });
  });

  describe("Delete Transaction", () => {
    it("should delete a transaction successfully", async () => {
      const mockTransaction = {
        id: 1,
        type: "INCOME",
        amount: 1000,
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      // Mock finding the transaction
      Transaction.findOne.mockResolvedValue(mockTransaction);

      const res = await request(app.listener)
        .delete("/transactions/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Transaction deleted successfully");
    });

    it("should fail to delete a transaction that does not exist", async () => {
      // Mock transaction not found
      Transaction.findOne.mockResolvedValue(null);

      const res = await request(app.listener)
        .delete("/transactions/999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Transaction not found or does not belong to the user"
      );
    });
  });
});
