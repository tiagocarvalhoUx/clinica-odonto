import { Router } from "express";
import { budgetController } from "../controllers/budget.controller.js";
import {
  createBudgetValidator,
  updateBudgetValidator,
} from "../validators/budget.validator.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", budgetController.getAll);
router.get("/:id", budgetController.getById);
router.get("/patient/:patientId", budgetController.getByPatientId);
router.post("/", createBudgetValidator, budgetController.create);
router.put("/:id", updateBudgetValidator, budgetController.update);
router.patch("/:id/status", budgetController.updateStatus);
router.delete("/:id", budgetController.delete);

export default router;
