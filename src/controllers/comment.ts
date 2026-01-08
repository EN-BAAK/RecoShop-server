import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { addComment as addCommentService, getProductComments as getProductCommentsService } from "../services/comment";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";

export const addComment = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, comment } = req.body
  const userId = req.id!

  const result = await addCommentService({ productId, comment, userId });
  sendSuccessResponse(res, 201, "Comment added successfully", result);
});

export const getProductComments = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId);
    const { limit, page } = req.query;

    const result = await getProductCommentsService({
      productId,
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : 1,
    });

    sendSuccessResponse(res, 200, "Comments fetched successfully", {
      items: result.comments,
      page: result.currentPage,
      limit: limit ? Number(limit) : undefined,
      total: result.totalCount,
      totalPages: result.totalPages,
      hasMore: result.currentPage < result.totalPages,
      nextPage: result.currentPage < result.totalPages ? result.currentPage + 1 : null,
      prevPage: result.currentPage > 1 ? result.currentPage - 1 : null,
    });
  }
);

