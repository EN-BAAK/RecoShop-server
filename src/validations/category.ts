import { body, param } from "express-validator";

export const createCategory = [
  body("title").notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),
  body("desc").notEmpty().withMessage("Description is required").isString().withMessage("Description must be a string"),
];

export const updateCategory = [
  param("id").isInt().withMessage("Invalid category id"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("desc").optional().isString().withMessage("Description must be a string"),
];

export const categoryId = [
  param("id").isInt().withMessage("Invalid category id"),
];
