import { body, param } from "express-validator";

export const groupBranchIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid group branch id"),
];

export const createGroupBranch = [
  body("name").notEmpty().withMessage("Name is required"),
];

export const updateGroupBranch = [
  param("id").isInt({ min: 1 }).withMessage("Invalid group branch id"),
  body("name").optional().isString(),
];
