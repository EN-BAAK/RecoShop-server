import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllSubCategories as getAllSubCategoriesService, getSubCategoryById as getSubCategoryByIdService, createSubCategory as createSubCategoryService, updateSubCategory as updateSubCategoryService, deleteSubCategory as deleteSubCategoryService, getSubCategoriesByCategoryTitle, } from "../services/subCategory";
import { sendSuccessResponse } from "../middlewares/success";
import { SubCategory } from "../models/subcategory";

export const getAllSubCategories = catchAsyncErrors(async (_: Request, res: Response) => {
  const subs = await getAllSubCategoriesService();
  sendSuccessResponse(res, 200, "Subcategories fetched successfully", subs);
});

export const getSubCategoriesByCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const { category } = req.params;
  const subCategories = await getSubCategoriesByCategoryTitle(category);
  sendSuccessResponse(res, 200, "Sub categories fetched successfully", subCategories);
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

export const isSubCategoriesRelatedToSameCategory = async (subCategories: number[]) => {
  if (!Array.isArray(subCategories) || subCategories.length === 0) {
    throw new Error("subCategories array is required");
  }

  const subs = await SubCategory.findAll({
    where: { id: subCategories },
    attributes: ["id", "categoryId"],
  });

  if (subs.length !== subCategories.length) {
    throw new Error("One or more subCategories do not exist");
  }

  const categoryIds = new Set(subs.map(sc => sc.categoryId));

  if (categoryIds.size !== 1) {
    throw new Error("All subCategories must belong to the same category");
  }

  return [...categoryIds][0];
};
