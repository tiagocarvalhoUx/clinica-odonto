import { validationResult } from "express-validator";
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      console.log("Login attempt:", req.body.email);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.login(req.body);
      console.log("Login successful:", result.user.email);
      res.json(result);
    } catch (error) {
      console.error("Login error:", error);
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};
