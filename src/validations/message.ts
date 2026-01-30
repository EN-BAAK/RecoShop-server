import { body, param } from "express-validator";

export const messageIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid message id"),
];

export const postMessage = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString(),
  body("subject").optional().isString(),
  body("msg").notEmpty().withMessage("Message is required"),
  body("username").optional().isString(),
];
