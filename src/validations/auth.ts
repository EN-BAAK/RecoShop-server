import { body, param } from "express-validator";
import { GOVERNORATE, SEX } from "../types/vars";

export const signup = [
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string")
    .isLength({ min: 2 }).withMessage("First name must be at least 2 characters"),

  body("lastName")
    .notEmpty().withMessage("Last name is required")
    .isString().withMessage("Last name must be a string")
    .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .isString().withMessage("Phone must be a string")
    .isLength({ min: 6 }).withMessage("Phone number is too short"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be a string")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("governorate")
    .notEmpty().withMessage("Governorate is required")
    .isIn(Object.values(GOVERNORATE)).withMessage("Invalid governorate"),

  body("gender")
    .optional()
    .isIn(Object.values(SEX)).withMessage("Invalid gender value"),
];

export const verifyAccount = [
  param("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("code")
    .notEmpty().withMessage("Code is required")
    .isLength({ min: 6, max: 6 }).withMessage("Code must be at exactly 6 characters")
]

export const checkEmailParam = [
  param("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),
];

export const resetForgottenPassword = [
  param("email").isEmail().withMessage("Invalid email"),
  body("code").notEmpty().withMessage("Reset code is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const login = [
  param("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be a string")
]