import { Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getUserBills as getUserBillsService, purchaseProducts as purchaseProductsService } from "../services/bills";
import { AuthenticatedRequest } from "../types/requests";

export const getUserBills = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate } = req.query;
  const userId = req.id!

  const bills = await getUserBillsService(
    userId,
    startDate as string | undefined,
    endDate as string | undefined
  );

  sendSuccessResponse(res, 200, "Bills fetched successfully", bills);
}
);

export const purchaseProducts = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { products } = req.body;
  const userId = req.id!

  const bill = await purchaseProductsService(userId, products);
  sendSuccessResponse(res, 201, "Purchase completed successfully", bill);
}
);