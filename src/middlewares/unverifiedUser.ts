import { UnverifiedUser } from "../models/unverifiedUser"
import ErrorHandler from "./error"

export const findUnverifiedUserByUserId = async (userId: number, transaction?: any) => {
  const user = await UnverifiedUser.findOne({ where: { userId }, transaction })

  if (!user)
    throw new ErrorHandler("User not found", 404)
  return user
}