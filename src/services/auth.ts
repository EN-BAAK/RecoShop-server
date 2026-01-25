import jwt from "jsonwebtoken"
import ErrorHandler from "../middlewares/error";
import { findUserByEmail, findUserById, findUserByIdWithRole } from "../middlewares/user";
import { UserCreationAttributes } from "../types/models";
import { User } from "../models/user";
import { sendAccountVerificationMessage, sendForgotPasswordVerificationCode } from "../middlewares/auth";
import { UnverifiedUser } from "../models/unverifiedUser";
import { findUnverifiedUserByUserId } from "../middlewares/unverifiedUser";
import { ResetPasswordRequest } from "../models/resetPasswordRequest";
import { findUserResetPasswordRequestByUserId } from "../middlewares/resetPasswordRequest";

export const signup = async (data: UserCreationAttributes, transaction: any) => {
  const existingUser = await User.findOne({ where: { email: data.email } })

  if (existingUser) {
    const isVerified = !await UnverifiedUser.findOne({ where: { userId: existingUser.id } });

    if (isVerified) {
      throw new ErrorHandler("User already exists", 400);
    }
    await existingUser.destroy({ transaction });
  }

  const createdUser = await User.create(data, { transaction });
  return await sendAccountVerificationMessage(createdUser.id, createdUser.email, undefined, transaction);
};

export const verifyAccount = async (email: string, verificationCode: string) => {
  const user = await findUserByEmail(email)
  const unverified = await findUnverifiedUserByUserId(user.id)

  if (unverified.code !== verificationCode) throw new ErrorHandler("Invalid verification code", 400);

  if (unverified.expire <= new Date()) throw new ErrorHandler("Verification code expired", 400);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  await UnverifiedUser.destroy({ where: { userId: user.id } });
  return { token }
};

export const resetVerificationCode = async (email: string, transaction?: any) => {
  const user = await findUserByEmail(email)
  const unverified = await findUnverifiedUserByUserId(user.id)

  const mailInfo = await sendAccountVerificationMessage(user.id, user.email, unverified, transaction);

  return mailInfo;
}

export const forgotPassword = async (email: string, transaction?: any) => {
  const user = await findUserByEmail(email)
  const existingRequest = await ResetPasswordRequest.findOne({ where: { userId: user.id } })

  return await sendForgotPasswordVerificationCode(user.id, user.email, existingRequest, transaction)
};

export const resetForgottenPassword = async (email: string, code: string, password: string) => {
  const user = await findUserByEmail(email)
  const request = await findUserResetPasswordRequestByUserId(user.id)

  if (request.code !== code) throw new ErrorHandler("Invalid reset code", 400);
  if (request.expire <= new Date()) throw new ErrorHandler("Reset code expired", 400);

  user.password = password;
  await user.save();

  await ResetPasswordRequest.destroy({ where: { userId: user.id } });
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email)
  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } })

  if (unverified)
    throw new ErrorHandler("Please verify your account before logging in", 403);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Wrong password", 401);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { token };
}

export const verify = async (userId: number) => {
  const userInfo = await findUserByIdWithRole(userId);
  return { ...userInfo };
};

export const resetPassword = async (userId: number, oldPassword: string, newPassword: string) => {
  const user = await findUserById(userId);

  const isMatch = await user.checkPassword(oldPassword);
  if (!isMatch) {
    throw new ErrorHandler("Password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};