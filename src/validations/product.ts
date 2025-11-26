import { body, param } from "express-validator";

export const createProduct = [
  body("title").notEmpty().withMessage("Title is required"),
  body("desc").notEmpty().withMessage("Description is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number"),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("categories must be a non-empty array"),
  body("categories.*")
    .isInt({ min: 1 })
    .withMessage("Each category id must be a valid number"),
];

export const updateProduct = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product id"),
  body("title").optional().isString(),
  body("desc").optional().isString(),
  body("brand").optional().isString(),
  body("price").optional().isFloat({ min: 0 }),
  body("categoryId").optional().isInt({ min: 1 }),
  body("image").optional(),
  body("removeImage").optional().isInt({ min: 0, max: 1 })
];

export const productIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product id"),
];
