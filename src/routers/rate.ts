import express from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { rateProduct as rateProductValidation, getProductRateStats as getProductRateStatsValidation, getMyRateForProduct as getMyRateForProductValidation } from "../validations/rate";
import { validation } from "../middlewares/error";
import { getProductRateStats, rateProduct, getMyRateForProduct } from "../controllers/rate";

const router = express.Router();

router.get("/:productId/stats", getProductRateStatsValidation, validation, getProductRateStats);
router.get("/:productId/my-rate", verifyAuthentication, getMyRateForProductValidation, validation, getMyRateForProduct);

router.post("/:productId", verifyAuthentication, rateProductValidation, validation, rateProduct);

export default router;
