import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/export/budgets", reportController.exportBudgets);
router.get("/export/patients", reportController.exportPatients);

export default router;
