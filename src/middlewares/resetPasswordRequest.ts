import { ResetPasswordRequest } from "../models/resetPasswordRequest"
import ErrorHandler from "./error"

export const findUserResetPasswordRequestByUserId = async (userId: number, transaction?: any) => {
  const user = await ResetPasswordRequest.findOne({ where: { userId }, transaction })

  if (!user)
    throw new ErrorHandler("User not found", 404)

  return user
}