import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getGroupBranchById as getGroupBranchByIdService, createGroupBranch as createGroupBranchService, updateGroupBranch as updateGroupBranchService, deleteGroupBranch as deleteGroupBranchService, getAllGroupBranches as getAllGroupBranchesService } from "../services/groupBranch";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllGroupBranches = catchAsyncErrors(async (_: Request, res: Response) => {
  const groupBranches = await getAllGroupBranchesService();
  sendSuccessResponse(res, 200, "Group branches fetched successfully", groupBranches);
});

export const getGroupBranchById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const groupBranch = await getGroupBranchByIdService(id);
  sendSuccessResponse(res, 200, "Group branch fetched successfully", groupBranch);
});

export const createGroupBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const groupBranch = await createGroupBranchService(data);
  sendSuccessResponse(res, 201, "Group branch created successfully", groupBranch);
});

export const updateGroupBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const groupBranch = await updateGroupBranchService(id, data);
  sendSuccessResponse(res, 200, "Group branch updated successfully", groupBranch);
});

export const deleteGroupBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteGroupBranchService(id);
  sendSuccessResponse(res, 200, "Group branch deleted successfully");

});
