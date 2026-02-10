import { validationResult } from "express-validator";
import { budgetService } from "../services/budget.service.js";

export const budgetController = {
  async getAll(req, res, next) {
    try {
      const budgets = await budgetService.getAll();
      res.json(budgets);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const budget = await budgetService.getById(req.params.id);
      res.json(budget);
    } catch (error) {
      next(error);
    }
  },

  async getByPatientId(req, res, next) {
    try {
      const budgets = await budgetService.getByPatientId(req.params.patientId);
      res.json(budgets);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Convert old format to new format if needed
      const items =
        req.body.items?.map((item) => ({
          description: item.description,
          unitPrice: item.unitPrice || item.price,
          quantity: item.quantity || 1,
        })) || [];

      const budgetData = {
        patientId: req.body.patientId,
        dentistId: req.body.dentistId,
        userId: req.user.id, // Get user ID from authenticated token
        items,
        notes: req.body.notes,
        discount: req.body.discount || 0,
      };

      const budget = await budgetService.create(budgetData);
      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const budget = await budgetService.update(req.params.id, req.body);
      res.json(budget);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await budgetService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!["EM_NEGOCIACAO", "ACEITO", "RECUSADO"].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const budget = await budgetService.updateStatus(req.params.id, status);
      res.json(budget);
    } catch (error) {
      next(error);
    }
  },
};
