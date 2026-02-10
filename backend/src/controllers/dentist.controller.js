import { validationResult } from "express-validator";
import { dentistService } from "../services/dentist.service.js";

export const dentistController = {
  async getAll(req, res, next) {
    try {
      const dentists = await dentistService.getAll();
      res.json(dentists);
    } catch (error) {
      next(error);
    }
  },

  async getActive(req, res, next) {
    try {
      const dentists = await dentistService.getActive();
      res.json(dentists);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const dentist = await dentistService.getById(req.params.id);
      res.json(dentist);
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

      const dentist = await dentistService.create(req.body);
      res.status(201).json(dentist);
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

      const dentist = await dentistService.update(req.params.id, req.body);
      res.json(dentist);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await dentistService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
