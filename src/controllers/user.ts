import { Request, Response } from "express";
import { getAllUsers as getAllUsersService, deleteUser as deleteUserService, getOwnProfile as getOwnProfileService, getUserProfile as getUserProfileService } from "../services/user";
import { AuthenticatedRequest } from "../types/requests";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllUsers = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { isVerified } = req.query;
  const excludeId = req.id;

  const users = await getAllUsersService(isVerified === undefined ? undefined : isVerified === "true", excludeId);
  sendSuccessResponse(res, 200, "Users fetched successfully", users);
})

export const getOwnProfile = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!
  const user = await getOwnProfileService(userId)

  return sendSuccessResponse(res, 200, "Profile fetched successfully", user)
})

export const getUserProfile = catchAsyncErrors(async (req: Request, res: Response) => {
  const userId = Number(req.params.id)
  const user = await getUserProfileService(userId)

  return sendSuccessResponse(res, 200, "Profile fetched successfully", user)
})

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUserService(Number(id));

  sendSuccessResponse(res, 200, result.msg);
};