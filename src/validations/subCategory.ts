import { body, param } from "express-validator";

export const createSubCategory = [
  body("title").notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),
  body("desc").notEmpty().withMessage("Description is required").isString().withMessage("Description must be a string"),
  body("categoryId").notEmpty().withMessage("categoryId is required").isInt().withMessage("Invalid category id"),
];

export const updateSubCategory = [
  param("id").isInt().withMessage("Invalid subcategory id"),
  body("title").optional().isString(),
  body("desc").optional().isString(),
  body("categoryId").optional().isInt().withMessage("Invalid category id"),
];

export const subCategoryId = [
  param("id").isInt().withMessage("Invalid subcategory id"),
];
