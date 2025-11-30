import { Request, Response } from "express";
import { getAllUsers as getAllUsersService, deleteUser as deleteUserService } from "../services/user";
import { AuthenticatedRequest } from "../types/requests";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllUsers = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { isVerified } = req.query;
  const excludeId = req.id;

  const users = await getAllUsersService(isVerified === undefined ? undefined : isVerified === "true", excludeId);
  sendSuccessResponse(res, 200, "Users fetched successfully", users);
})

// export const handleGetUserById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const user = await getUserById(Number(id));
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// };

// export const handleGetProfile = async (req: AuthenticatedRequest, res: Response) => {
//   const userId = req.id!;

//   try {
//     const user = await getProfile(userId);
//     if (!user) {
//       return res.status(404).json({ error: "Profile not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// };

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUserService(Number(id));

  sendSuccessResponse(res, 200, result.msg);
};