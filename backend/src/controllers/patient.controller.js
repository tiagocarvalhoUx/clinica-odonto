import { validationResult } from "express-validator";
import { patientService } from "../services/patient.service.js";

export const patientController = {
  async getAll(req, res, next) {
    try {
      const patients = await patientService.getAll();
      res.json(patients);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const patient = await patientService.getById(req.params.id);
      res.json(patient);
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

      const patient = await patientService.create(req.body);
      res.status(201).json(patient);
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

      const patient = await patientService.update(req.params.id, req.body);
      res.json(patient);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await patientService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
