import { body, param } from "express-validator";

export const createBrand = [
  body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
];

export const updateBrand = [
  param("id").isInt().withMessage("Invalid brand id"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("removeImage").optional().isInt({ min: 0, max: 1 }).withMessage("removeImage must be 0 or 1"),
];

export const brandId = [
  param("id").isInt().withMessage("Invalid brand id"),
];