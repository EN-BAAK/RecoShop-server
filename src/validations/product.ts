import { body, param } from "express-validator";

export const createProduct = [
  body("title").notEmpty().withMessage("Title is required"),
  body("desc").notEmpty().withMessage("Description is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number"),
  body("categoryId").isInt({ min: 1 }).withMessage("Valid categoryId is required"),
];

export const updateProduct = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product id"),
  body("title").optional().isString(),
  body("desc").optional().isString(),
  body("brand").optional().isString(),
  body("price").optional().isFloat({ min: 0 }),
  body("categoryId").optional().isInt({ min: 1 }),
  body("imgUrl").optional(),
];

export const productIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product id"),
];
