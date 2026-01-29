import { body, param } from "express-validator";

export const branchIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid branch id"),
];

export const createBranch = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location").optional().isString(),
  body("facebook").optional().isString(),
  body("instagram").optional().isString(),
  body("phone").optional().isString(),
  body("telephone").optional().isString(),
  body("groupId").optional().isInt({ min: 1 }).withMessage("GroupId must be a valid id"),
];

export const updateBranch = [
  param("id").isInt({ min: 1 }).withMessage("Invalid branch id"),
  body("name").optional().isString(),
  body("location").optional().isString(),
  body("facebook").optional().isString(),
  body("instagram").optional().isString(),
  body("phone").optional().isString(),
  body("telephone").optional().isString(),
  body("groupId").optional().isInt({ min: 1 }).withMessage("GroupId must be a valid id"),
];
