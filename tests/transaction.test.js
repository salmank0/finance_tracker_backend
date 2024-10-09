const request = require("supertest");
const Hapi = require("@hapi/hapi");
const { Transaction } = require("../models"); // Mock Sequelize model
jest.mock("../models");

describe("Transaction API Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = new Hapi.Server({ port: 3000 });
    await app.register(require("../routes/transactionRoutes")); // Register routes
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  // Mock transaction creation
  Transaction.create.mockResolvedValue({
    id: 1,
    type: "income",
    amount: 1000,
    userId: 1,
  });

  it("should create a transaction", async () => {
    const res = await request(app.listener).post("/transactions").send({
      type: "income",
      amount: 1000,
      userId: 1,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("id");
  });

  // Mock fetching transactions
  Transaction.findAll.mockResolvedValue([
    {
      id: 1,
      type: "income",
      amount: 1000,
      userId: 1,
    },
  ]);

  it("should fetch all transactions", async () => {
    const res = await request(app.listener).get("/transactions");

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
