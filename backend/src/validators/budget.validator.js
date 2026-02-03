import { body } from "express-validator";

export const createBudgetValidator = [
  body("patientId")
    .notEmpty()
    .withMessage("ID do paciente é obrigatório")
    .isInt({ min: 1 })
    .withMessage("ID do paciente deve ser um número válido"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Orçamento deve conter pelo menos um item"),
  body("items.*.description")
    .notEmpty()
    .withMessage("Descrição do item é obrigatória")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Descrição deve ter no máximo 255 caracteres"),
  body("items.*.price")
    .notEmpty()
    .withMessage("Preço do item é obrigatório")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um valor positivo"),
  body("notes").optional().trim(),
];

export const updateBudgetValidator = [
  body("status")
    .optional()
    .isIn(["EM_NEGOCIACAO", "ACEITO", "RECUSADO"])
    .withMessage("Status inválido"),
  body("notes").optional().trim(),
  body("items").optional().isArray().withMessage("Items deve ser um array"),
  body("items.*.description")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Descrição deve ter no máximo 255 caracteres"),
  body("items.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um valor positivo"),
];
