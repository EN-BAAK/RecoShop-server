import jwt from "jsonwebtoken"
import { NextFunction, Response } from "express";
import { ResetPasswordRequest } from "../models/resetPasswordRequest";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import ErrorHandler, { catchAsyncErrors } from "./error";
import { isBlacklisted } from "../utils/tokenBlacklist";
import { User } from "../models/user";
import { AuthenticatedRequest } from "../types/requests";

export const sendAccountVerificationMessage = async (
  userId: number,
  email: string,
  unverified: undefined | UnverifiedUser,
  transaction?: any
) => {

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const code = generateVerificationCode();

  if (unverified) {
    unverified.code = code
    unverified.expire = expiresAt
    await unverified.save({ transaction })
  } else {
    await UnverifiedUser.create({
      userId,
      code,
      expire: expiresAt,
    }, { transaction });
  }

  return { email, code };
};

export const sendForgotPasswordVerificationCode = async (
  userId: number,
  email: string,
  resetRequest: undefined | ResetPasswordRequest | null,
  transaction?: any
) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const code = generateVerificationCode();

  if (resetRequest) {
    resetRequest.code = code
    resetRequest.expire = expiresAt
    await resetRequest.save({ transaction })
  } else {
    await ResetPasswordRequest.create({
      userId,
      code,
      expire: expiresAt,
    }, { transaction });
  }

  return { email, code };
}

export const verifyAuthentication = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.[process.env.COOKIE_NAME!];

    if (!token)
      return next(new ErrorHandler('Unauthorized: Token not found', 401));

    if (isBlacklisted(token)) {
      res.clearCookie(process.env.COOKIE_NAME!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return next(new ErrorHandler("Unauthorized: Token expired", 401));
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    const user = await User.findByPk(payload.userId, { attributes: ['id'] });
    if (!user) {
      res.clearCookie(process.env.COOKIE_NAME!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return next(new ErrorHandler('User not found', 401));
    }

    req.id = user.id

    next();
  }
);