import { body, query } from "express-validator";

export const purchaseProducts = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  body("products.*.productId")
    .isInt({ min: 1 })
    .withMessage("Product id must be a valid number"),

  body("products.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
]


export const getUserBills = [
  query("startDate")
    .optional()
    .isISO8601().withMessage("Invalid startDate"),

  query("endDate")
    .optional()
    .isISO8601().withMessage("Invalid endDate"),
];
