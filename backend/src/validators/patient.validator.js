import { body } from "express-validator";

export const createPatientValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nome deve ter entre 3 e 100 caracteres"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Telefone deve ter no máximo 20 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
];

export const updatePatientValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nome deve ter entre 3 e 100 caracteres"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Telefone deve ter no máximo 20 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
];
