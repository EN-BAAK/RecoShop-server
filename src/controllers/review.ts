import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { addReview as addReviewService } from "../services/review";
import { sendSuccessResponse } from "../middlewares/success";

export const addReview = catchAsyncErrors(async (req: Request, res: Response) => {
  const review = await addReviewService(req.body);
  sendSuccessResponse(res, 201, "Review added successfully", review);
});
