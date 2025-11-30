import { Router } from "express";
import { getAllUsers, deleteUser, } from "../controllers/user";
import { getAllUsers as getAllUsersValidation, deleteUser as deleteUserValidation, } from "../validations/user";
import { verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";

const router = Router();


router.get("/", verifyAuthentication, getAllUsersValidation, validation, getAllUsers);
// router.get("/:id", verifyAuthentication, getUserByIdValidation, validation, handleGetUserById);
// router.get("/profile", verifyAuthentication, handleGetProfile);

router.delete("/:id", verifyAuthentication, deleteUserValidation, validation, deleteUser);

export default router;