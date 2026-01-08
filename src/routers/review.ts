import express from "express";
import { addReview } from "../controllers/review";
import { verifyAuthentication } from "../middlewares/auth";
import { addReview as addReviewValidation } from "../validations/review";
import { validation } from "../middlewares/error";

const router = express.Router();

router.post("/", verifyAuthentication, addReviewValidation, validation, addReview);

export default router;
