import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getDashboardData as getDashboardDataService } from "../services/dashboard";
import { sendSuccessResponse } from "../middlewares/success";

export const getDashboardData = catchAsyncErrors(async (_: Request, res: Response) => {
  const results = await getDashboardDataService();
  sendSuccessResponse(res, 200, "Dashboard Data Fetched Successfully", results);
})