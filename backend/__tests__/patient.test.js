import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import patientRoutes from "../src/routes/patient.routes.js";
import { errorHandler } from "../src/middlewares/error.middleware.js";

const app = express();
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use(errorHandler);

const generateTestToken = (userId = 1) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
};

describe("Patient API", () => {
  let authToken;

  beforeEach(() => {
    authToken = generateTestToken();
  });

  describe("GET /api/patients", () => {
    test("deve retornar 401 sem autenticação", async () => {
      const response = await request(app).get("/api/patients");

      expect(response.status).toBe(401);
    });

    test("deve aceitar requisição com token válido", async () => {
      const response = await request(app)
        .get("/api/patients")
        .set("Authorization", `Bearer ${authToken}`);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("POST /api/patients", () => {
    test("deve retornar 401 sem autenticação", async () => {
      const response = await request(app).post("/api/patients").send({
        name: "João Silva",
        phone: "11999999999",
      });

      expect(response.status).toBe(401);
    });

    test("deve validar dados obrigatórios", async () => {
      const response = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    test("deve validar formato de telefone", async () => {
      const response = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "João Silva",
          phone: "invalid",
        });

      expect(response.status).toBe(400);
    });
  });
});
