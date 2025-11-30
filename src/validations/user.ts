import { param, query } from "express-validator";

export const getAllUsers = [
  query("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),
];

export const getUserById = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

export const deleteUser = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
];