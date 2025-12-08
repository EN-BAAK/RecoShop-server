import { Router } from "express";
import { getAllUsers, deleteUser, } from "../controllers/user";
import { getAllUsers as getAllUsersValidation, deleteUser as deleteUserValidation, } from "../validations/user";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";
import { PERMISSIONS } from "../constants/globals";

const router = Router();


router.get("/", verifyAuthentication, getAllUsersValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllUsers);
// router.get("/:id", verifyAuthentication, getUserByIdValidation, validation, handleGetUserById);
// router.get("/profile", verifyAuthentication, handleGetProfile);

router.delete("/:id", verifyAuthentication, deleteUserValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteUser);

export default router;