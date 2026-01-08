import { body, param } from "express-validator";

export const rateProduct = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Product id must be a valid integer"),

  body("rate")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rate must be an integer between 1 and 5"),
];


export const getProductRateStats = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Invalid product id"),
];

export const getMyRateForProduct = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Invalid product id"),
];