import { describe, test, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import authRoutes from "../src/routes/auth.routes.js";
import { errorHandler } from "../src/middlewares/error.middleware.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    test("deve retornar erro quando dados inválidos", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    test("deve validar formato de email se fornecido", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "Test@1234",
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    test("deve retornar erro quando credenciais não fornecidas", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    test("deve validar comprimento mínimo de senha", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "123",
      });

      expect(response.status).toBe(400);
    });
  });
});
