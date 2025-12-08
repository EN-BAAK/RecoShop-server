import jwt from "jsonwebtoken"
import { NextFunction, Response } from "express";
import { ResetPasswordRequest } from "../models/resetPasswordRequest";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import ErrorHandler, { catchAsyncErrors } from "./error";
import { isBlacklisted } from "../utils/tokenBlacklist";
import { User } from "../models/user";
import { AuthenticatedRequest } from "../types/requests";
import { ROLES } from "../constants/globals";
import { Permission } from "../models/permission";

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
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
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

export const verifyAuthenticationHeader = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("Unauthorized: Token not found", 401));
    }

    const token = authHeader.split(" ")[1];

    if (isBlacklisted(token)) {
      return next(new ErrorHandler("Unauthorized: Token expired", 401));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const user = await User.findByPk(payload.userId, { attributes: ["id"] });
    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.id = user.id;

    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ErrorHandler("Unauthorized: Invalid or expired token", 401));
    }
    next(err);
  }
};

export function hasPermission(userRole: number, permission: number) {
  return (userRole & permission) !== 0;
}

export const requirePermission = (requiredPermission: number) => {
  return catchAsyncErrors(async (req: AuthenticatedRequest, __: Response, next: NextFunction) => {
    const userId = req.id!;

    const permissions = await Permission.findOne({ where: { userId } })

    if (!permissions)
      return next(new ErrorHandler("Not allowed", 403))

    if (!hasPermission(permissions?.permissions, requiredPermission)) {
      return next(new ErrorHandler("Not allowed", 403));
    }
    next();
  })
}

export const getClosestRole = (permissionValue: number) => {
  const roleEntries = Object.entries(ROLES);

  roleEntries.sort((a, b) => a[1] - b[1]);

  let bestMatch = null;

  for (const [roleName, roleValue] of roleEntries) {
    if ((permissionValue & roleValue) === roleValue) {
      bestMatch = roleName;
    }
  }

  return bestMatch;
};

