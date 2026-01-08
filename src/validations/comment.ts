import { body, param, query } from "express-validator";

export const addComment = [
  body("productId")
    .isInt({ min: 1 })
    .withMessage("Product id must be a valid integer"),

  body("comment")
    .isString()
    .notEmpty()
    .withMessage("Comment is required"),
];

export const getProductComments = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Invalid product id"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];