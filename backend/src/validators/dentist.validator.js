import { body } from "express-validator";

export const createDentistValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 255 })
    .withMessage("Nome deve ter no máximo 255 caracteres"),
  body("cro")
    .notEmpty()
    .withMessage("CRO é obrigatório")
    .isLength({ max: 20 })
    .withMessage("CRO deve ter no máximo 20 caracteres"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Email inválido")
    .isLength({ max: 255 })
    .withMessage("Email deve ter no máximo 255 caracteres"),
  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage("Telefone deve ter no máximo 20 caracteres"),
  body("specialty")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage("Especialidade deve ter no máximo 100 caracteres"),
];

export const updateDentistValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 255 })
    .withMessage("Nome deve ter no máximo 255 caracteres"),
  body("cro")
    .notEmpty()
    .withMessage("CRO é obrigatório")
    .isLength({ max: 20 })
    .withMessage("CRO deve ter no máximo 20 caracteres"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Email inválido")
    .isLength({ max: 255 })
    .withMessage("Email deve ter no máximo 255 caracteres"),
  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage("Telefone deve ter no máximo 20 caracteres"),
  body("specialty")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage("Especialidade deve ter no máximo 100 caracteres"),
];
