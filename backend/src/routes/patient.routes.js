import { Router } from "express";
import { patientController } from "../controllers/patient.controller.js";
import {
  createPatientValidator,
  updatePatientValidator,
} from "../validators/patient.validator.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", patientController.getAll);
router.get("/:id", patientController.getById);
router.post("/", createPatientValidator, patientController.create);
router.put("/:id", updatePatientValidator, patientController.update);
router.delete("/:id", patientController.delete);

export default router;
