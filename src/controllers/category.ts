import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import {
  getCategories as getCategoriesService,
  getCategory as getCategoryService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategoryById as deleteCategoryByIdService,
  getAllCategoriesWithSubCategory as getAllCategoriesWithSubCategoryService
} from "../services/category";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllCategories = catchAsyncErrors(async (_: Request, res: Response) => {
  const categories = await getCategoriesService();
  sendSuccessResponse(res, 200, "Categories fetched successfully", categories);
});

export const getCategoryById = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await getCategoryService(parseInt(id));
  sendSuccessResponse(res, 200, "Category fetched successfully", category);
});

export const getAllCategoriesWithSubCategory = catchAsyncErrors(async (_: Request, res: Response) => {
  const categories = await getAllCategoriesWithSubCategoryService();
  sendSuccessResponse(res, 200, "Categories with subcategories fetched successfully", categories);
});

export const createCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const category = await createCategoryService(data);
  sendSuccessResponse(res, 201, "Category created successfully", category);
});

export const updateCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const category = await updateCategoryService(parseInt(id), data);
  sendSuccessResponse(res, 200, "Category updated successfully", category);
});

export const deleteCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCategoryByIdService(parseInt(id));
  sendSuccessResponse(res, 200, result.message);
});
