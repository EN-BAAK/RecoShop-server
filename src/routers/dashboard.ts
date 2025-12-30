import { Router } from "express";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";
import { getDashboardData } from "../controllers/dashboard";

const router = Router()

router.get("/", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getDashboardData)

export default router;