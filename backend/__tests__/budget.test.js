import { describe, test, expect, jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import budgetRoutes from "../src/routes/budget.routes.js";
import { errorHandler } from "../src/middlewares/error.middleware.js";

const app = express();
app.use(express.json());
app.use("/api/budgets", budgetRoutes);
app.use(errorHandler);

// Helper para gerar token de teste
const generateTestToken = (userId = 1) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
};

describe("Budget API", () => {
  let authToken;

  beforeEach(() => {
    authToken = generateTestToken();
  });

  describe("GET /api/budgets", () => {
    test("deve retornar 401 sem autenticação", async () => {
      const response = await request(app).get("/api/budgets");

      expect(response.status).toBe(401);
    });

    test("deve aceitar requisição com token válido", async () => {
      const response = await request(app)
        .get("/api/budgets")
        .set("Authorization", `Bearer ${authToken}`);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("POST /api/budgets", () => {
    test("deve retornar 401 sem autenticação", async () => {
      const response = await request(app).post("/api/budgets").send({
        patientId: 1,
        items: [],
      });

      expect(response.status).toBe(401);
    });

    test("deve validar dados obrigatórios", async () => {
      const response = await request(app)
        .post("/api/budgets")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
