import { Router } from "express";
import { checkEmailParam, login as loginValidation, resetForgottenPassword as resetForgottenPasswordValidation, signup as signupValidation, verifyAccount as verifyAccountValidation, resetPassword as resetPasswordValidation } from "../validations/auth";
import { signup, resetVerificationCode, verifyAccount, logout, forgotPassword, resetForgottenPassword, login, verify, resetPassword } from "../controllers/auth";
import { validation } from "../middlewares/error";
import { verifyAuthentication, verifyAuthenticationHeader } from "../middlewares/auth";

const router = Router()

router.get("/verify", verifyAuthentication, verify);
router.get("/verify-protected-middleware", verifyAuthenticationHeader, verify);

router.post("/signup", signupValidation, validation, signup);
router.post("/login", loginValidation, validation, login);
router.post("/logout", verifyAuthentication, logout);

router.post("/verify-account/:email", verifyAccountValidation, validation, verifyAccount);

router.post("/resend-verification-code/:email", checkEmailParam, validation, resetVerificationCode);
router.post("/forgot-password/:email", checkEmailParam, validation, forgotPassword)

router.post("/reset-password", verifyAuthentication, resetPasswordValidation, validation, resetPassword);

router.put("/reset-forgotten-password/:email", resetForgottenPasswordValidation, validation, resetForgottenPassword)

export default router;