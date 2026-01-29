import express from "express";
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../controllers/branch";
import { branchIdParam, createBranch as createBranchValidation, updateBranch as updateBranchValidation } from "../validations/branch";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = express.Router();

router.get("/", getBranches);
router.get("/:id", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), branchIdParam, validation, getBranchById);

router.post("/", verifyAuthentication, requirePermission(PERMISSIONS.ADD), createBranchValidation, validation, createBranch);

router.put("/:id", verifyAuthentication, requirePermission(PERMISSIONS.EDIT), branchIdParam, updateBranchValidation, validation, updateBranch);

router.delete("/:id", verifyAuthentication, requirePermission(PERMISSIONS.DELETE), branchIdParam, validation, deleteBranch);

export default router;
