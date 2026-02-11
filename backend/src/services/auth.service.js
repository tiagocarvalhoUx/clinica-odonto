import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { authConfig } from "../config/auth.js";

export const authService = {
  async register({ name, email, password, role = "FUNCIONARIA" }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw { statusCode: 409, message: "Email já cadastrado" };
    }

    const hashedPassword = await bcrypt.hash(
      password,
      authConfig.bcryptSaltRounds,
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
    );

    return { user, token };
  },

  async login({ email, password }) {
    console.log("Service login - searching user:", email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Service login - user found:", user ? "yes" : "no");

    if (!user) {
      throw { statusCode: 401, message: "Credenciais inválidas" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { statusCode: 401, message: "Credenciais inválidas" };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }

    return user;
  },
};
