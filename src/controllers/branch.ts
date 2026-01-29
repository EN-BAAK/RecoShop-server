import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getBranches as getBranchesService, getBranchById as getBranchByIdService, createBranch as createBranchService, updateBranch as updateBranchService, deleteBranch as deleteBranchService } from "../services/branch";
import { sendSuccessResponse } from "../middlewares/success";

export const getBranches = catchAsyncErrors(async (_: Request, res: Response) => {
  const branches = await getBranchesService();
  sendSuccessResponse(res, 200, "Branches fetched successfully", branches);
});

export const getBranchById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const branch = await getBranchByIdService(id);
  sendSuccessResponse(res, 200, "Branch fetched successfully", branch);
});

export const createBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const branch = await createBranchService(data);
  sendSuccessResponse(res, 201, "Branch created successfully", branch);
});

export const updateBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  const branch = await updateBranchService(id, data);
  sendSuccessResponse(res, 200, "Branch updated successfully", branch);
});

export const deleteBranch = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteBranchService(id);
  sendSuccessResponse(res, 200, "Branch deleted successfully");
});
