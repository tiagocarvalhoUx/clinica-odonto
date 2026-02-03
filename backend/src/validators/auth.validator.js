import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nome deve ter entre 3 e 100 caracteres"),
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
  body("role")
    .optional()
    .isIn(["ADMIN", "FUNCIONARIA"])
    .withMessage("Perfil inválido"),
];
