import { Router } from "express";
import { purchaseProducts, getUserBills } from "../controllers/bills";
import { purchaseProducts as purchaseProductsValidation, getUserBills as getUserBillsValidation } from "../validations/bills";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = Router();

router.get("/", verifyAuthentication,  getUserBillsValidation, validation, getUserBills);

router.post("/purchase", verifyAuthentication, requirePermission(PERMISSIONS.BUY), purchaseProductsValidation, validation, purchaseProducts);

export default router;
