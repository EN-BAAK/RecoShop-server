import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllSubCategories as getAllSubCategoriesService, getSubCategoryById as getSubCategoryByIdService, createSubCategory as createSubCategoryService, updateSubCategory as updateSubCategoryService, deleteSubCategory as deleteSubCategoryService, } from "../services/subCategory";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllSubCategories = catchAsyncErrors(async (req: Request, res: Response) => {
  const subs = await getAllSubCategoriesService();
  sendSuccessResponse(res, 200, "Subcategories fetched successfully", subs);
});

export const getSubCategoryById = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sub = await getSubCategoryByIdService(parseInt(id));
  sendSuccessResponse(res, 200, "Subcategory fetched successfully", sub);
});

export const createSubCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const sub = await createSubCategoryService(req.body);
  sendSuccessResponse(res, 201, "Subcategory created successfully", sub);
});

export const updateSubCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sub = await updateSubCategoryService(parseInt(id), req.body);
  sendSuccessResponse(res, 200, "Subcategory updated successfully", sub);
});

export const deleteSubCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteSubCategoryService(parseInt(id));
  sendSuccessResponse(res, 200, result.message);
});
