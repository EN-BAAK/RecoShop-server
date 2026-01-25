import { Router } from "express";
import { getAllUsers, deleteUser, getOwnProfile, getUserProfile } from "../controllers/user";
import { getAllUsers as getAllUsersValidation, deleteUser as deleteUserValidation, getUserProfile as getUserProfileValidation, } from "../validations/user";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";
import { PERMISSIONS } from "../constants/globals";

const router = Router();


router.get("/", verifyAuthentication, getAllUsersValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllUsers);
router.get("/profile", verifyAuthentication, getOwnProfile);
router.get("/:id", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getUserProfileValidation, validation, getUserProfile);

router.delete("/:id", verifyAuthentication, deleteUserValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteUser);

export default router;