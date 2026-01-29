import express from "express";
import { getGroupBranchById, createGroupBranch, updateGroupBranch, deleteGroupBranch, getAllGroupBranches } from "../controllers/groupBranch";
import { groupBranchIdParam as groupBranchIdParamValidation, createGroupBranch as createGroupBranchValidation, updateGroupBranch as updateGroupBranchValidation } from "../validations/groupBranch";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = express.Router();

router.get("/", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllGroupBranches);
router.get("/:id", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), groupBranchIdParamValidation, validation, getGroupBranchById);

router.post("/", verifyAuthentication, requirePermission(PERMISSIONS.ADD), createGroupBranchValidation, validation, createGroupBranch);

router.put("/:id", verifyAuthentication, requirePermission(PERMISSIONS.EDIT), groupBranchIdParamValidation, updateGroupBranchValidation, validation, updateGroupBranch);

router.delete("/:id", verifyAuthentication, requirePermission(PERMISSIONS.DELETE), groupBranchIdParamValidation, validation, deleteGroupBranch);

export default router;
