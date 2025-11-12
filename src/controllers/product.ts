import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllProducts as getAllProductsService, getProductById as getProductByIdService, getProductImage as getProductImageService, createProduct as createProductService, updateProduct as updateProductService, deleteProduct as deleteProductService, } from "../services/product";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllProducts = catchAsyncErrors(async (_: Request, res: Response) => {
  const products = await getAllProductsService();
  sendSuccessResponse(res, 200, "Products fetched successfully", products);
});

export const getProductById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = await getProductByIdService(id);
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
