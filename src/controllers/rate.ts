import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { addOrUpdateRate, getProductRateStats as getProductRateStatsService, getMyRateForProduct as getMyRateForProductService } from "../services/rate";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";

export const rateProduct = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const productId = Number(req.params.productId)
  const userId = req.id!
  const { rate } = req.body

  const result = await addOrUpdateRate({ productId, rate, userId });
  sendSuccessResponse(res, 200, "Rate saved successfully", result);
});

export const getProductRateStats = catchAsyncErrors(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const stats = await getProductRateStatsService(productId);

  sendSuccessResponse(res, 200, "Rate stats fetched successfully", stats);
}
);

export const getMyRateForProduct = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!;
  const productId = parseInt(req.params.productId);

  const rate = await getMyRateForProductService(userId, productId);

  sendSuccessResponse(res, 200, "User rate fetched successfully", rate);
}
);