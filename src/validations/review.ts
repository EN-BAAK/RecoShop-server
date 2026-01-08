import { body } from "express-validator";

export const addReview = [
  body("userId")
    .isInt({ min: 1 })
    .withMessage("User id must be a valid integer"),

  body("productId")
    .isInt({ min: 1 })
    .withMessage("Product id must be a valid integer"),
];
