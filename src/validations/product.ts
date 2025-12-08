import { body, param, query } from "express-validator";

export const getAllProductsValidation = [
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("offsetUnit").optional().isInt({ min: 0 }).withMessage("offsetUnit must be a non-negative integer"),
];

export const createProduct = [
  body("title").notEmpty().withMessage("Title is required"),
  body("desc").notEmpty().withMessage("Description is required"),
  body("brandId").notEmpty().withMessage("Brand is required").isInt({ min: 1 }).withMessage("Brand must be a valid id"),
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
  body("brandId").optional().isInt({ min: 1 }).withMessage("Brand must be a valid id"),
  body("price").optional().isFloat({ min: 0 }),
  body("categoryId").optional().isInt({ min: 1 }),
  body("image").optional(),
  body("removeImage").optional().isInt({ min: 0, max: 1 })
];

export const productIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product id"),
];

export const getProductsByCategory = [
  query("search").optional().isString(),
  query("category").optional().isString(),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("offset").optional().isInt({ min: 0 }).withMessage("Offset must be a non-negative integer"),
];
