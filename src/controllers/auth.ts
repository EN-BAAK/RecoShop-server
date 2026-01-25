import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { signup as signupService, resetVerificationCode as resetVerificationCodeService, verifyAccount as verifyAccountService, forgotPassword as forgotPasswordService, resetForgottenPassword as resetForgottenPasswordService, login as loginService, verify as verifyService, resetPassword as resetPasswordService } from "../services/auth";
import { sendSuccessResponse } from "../middlewares/success";
import { forgotPasswordMessage, sendEmail, verifyAccountMessage } from "../utils/mail";
import db from "../models";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { AuthenticatedRequest } from "../types/requests";

export const signup = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  let verification;

  await db.sequelize!.transaction(async (transaction) => {
    verification = await signupService(data, transaction);
  });

  const { code, email } = verification!
  const msg = verifyAccountMessage(code)

  await sendEmail(email, "Verify Account Code", msg);

  sendSuccessResponse(res, 201, "User created successfully. Please check your email to verify your account.", { email });
});

export const verifyAccount = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { code } = req.body;

  const { token } = await verifyAccountService(email, code);

  res.cookie(process.env.COOKIE_NAME!, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseInt(process.env.COOKIE_EXPIRE_MS!, 10)
  });

  sendSuccessResponse(res, 200, "Account verified successfully.");
});

export const resetVerificationCode = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email } = req.params;

  let mailInfo: { email: string; code: string };

  await db.sequelize!.transaction(async (transaction) => {
    mailInfo = await resetVerificationCodeService(email, transaction);
  });

  const { code } = mailInfo!
  const msg = verifyAccountMessage(code)

  await sendEmail(email, "Verify Account Code", msg);

  sendSuccessResponse(res, 200, "Verification code has been resent. Please check your email.");
});

export const forgotPassword = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email } = req.params;
  let request;

  await db.sequelize!.transaction(async (transaction) => {
    request = await forgotPasswordService(email, transaction);
  });

  const { code } = request!
  const msg = forgotPasswordMessage(code)

  await sendEmail(email, "Password Reset Code", msg);

  sendSuccessResponse(res, 200, "Password reset code has been sent to your email.");
});

export const resetForgottenPassword = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { code, password } = req.body;

  await resetForgottenPasswordService(email, code, password);

  sendSuccessResponse(res, 200, "Password has been reset successfully.");
});

export const logout = catchAsyncErrors(async (req: Request, res: Response) => {
  const token = req.cookies?.[process.env.COOKIE_NAME!];
  if (token) {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (decoded?.exp) {
      addToBlacklist(token, decoded.exp);
    }
  }

  res.clearCookie(process.env.COOKIE_NAME!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendSuccessResponse(res, 200, "Logged out successfully");
});

export const login = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token } = await loginService(email, password);

  res.cookie(process.env.COOKIE_NAME!, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseInt(process.env.COOKIE_EXPIRE_MS!, 10)
  });

  sendSuccessResponse(res, 200, "Logged in successfully")
})

export const verify = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!

  const result = await verifyService(userId);
  sendSuccessResponse(res, 200, "Verified", result)
})

export const resetPassword = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!;
  const { oldPassword, newPassword } = req.body;

  await resetPasswordService(userId, oldPassword, newPassword);

  sendSuccessResponse(res, 200, "Password reset successfully");
});