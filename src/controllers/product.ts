import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllProducts as getAllProductsService, getProductSettingsById as getProductSettingsByIdService, getProductImage as getProductImageService, createProduct as createProductService, updateProduct as updateProductService, deleteProduct as deleteProductService, getPaginatedProductsWithFiltering as getProductsPaginatedWithFilteringService, getProductById as getProductByIdService, getRelatedProducts as getRelatedProductsService } from "../services/product";
import { sendSuccessResponse } from "../middlewares/success";
import { getAuthenticatedUserId } from "../middlewares/auth";
import { addReview } from "../services/review";

export const getAllProducts = catchAsyncErrors(async (req: Request, res: Response) => {
  const { limit, page, offsetUnit } = req.query;

  const result = await getAllProductsService({
    limit: limit ? Number(limit) : undefined,
    page: page ? Number(page) : undefined,
    offsetUnit: offsetUnit ? Number(offsetUnit) : undefined,
  });

  return sendSuccessResponse(res, 200, "Products fetched successfully", {
    items: result.products,
    page: result.currentPage,
    limit: limit ? Number(limit) : undefined,
    total: result.totalCount,
    totalPages: result.totalPages,
    hasMore: result.currentPage < result.totalPages,
    nextPage: result.currentPage < result.totalPages ? result.currentPage + 1 : null,
    prevPage: result.currentPage > 1 ? result.currentPage - 1 : null,
  });
});

export const getProductSettingsById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = await getProductSettingsByIdService(id);
  sendSuccessResponse(res, 200, "Product fetched successfully", product);
});

export const getProductById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userId = await getAuthenticatedUserId(req)

  const product = await getProductByIdService(id);
  await addReview({ userId, productId: product.id })
  sendSuccessResponse(res, 200, "Product fetched successfully", product);
});

export const getProductImage = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const imagePath = await getProductImageService(id);
  res.sendFile(imagePath);
});

export const createProduct = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const file = req.file;
  const product = await createProductService(data, file!);
  sendSuccessResponse(res, 201, "Product created successfully", product);
});

export const updateProduct = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const file = req.file;
  const product = await updateProductService(id, data, file!);
  sendSuccessResponse(res, 200, "Product updated successfully", product);
});

export const deleteProduct = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await deleteProductService(id);
  sendSuccessResponse(res, 200, result.message);
});

export const getProductsPaginatedWithFiltering = catchAsyncErrors(async (req: Request, res: Response) => {
  const { search, category, limit, page } = req.query;

  const products = await getProductsPaginatedWithFilteringService({
    search: search as string,
    category: category ? String(category) : undefined,
    limit: limit ? Number(limit) : undefined,
    page: Number(page)
  });

  sendSuccessResponse(res, 200, "Products fetched successfully", products);
});

export const getRelatedProducts = catchAsyncErrors(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id)
  const products = await getRelatedProductsService(productId);

  sendSuccessResponse(res, 200, "Products fetched successfully", products);
})