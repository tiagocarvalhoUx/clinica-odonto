import { Router } from "express";
import { dentistController } from "../controllers/dentist.controller.js";
import {
  createDentistValidator,
  updateDentistValidator,
} from "../validators/dentist.validator.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", dentistController.getAll);
router.get("/active", dentistController.getActive);
router.get("/:id", dentistController.getById);
router.post("/", createDentistValidator, dentistController.create);
router.put("/:id", updateDentistValidator, dentistController.update);
router.delete("/:id", dentistController.delete);

export default router;
