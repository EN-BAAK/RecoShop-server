import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllBrands as getAllBrandsService, getBrandById as getBrandByIdService, createBrand as createBrandService, updateBrand as updateBrandService, deleteBrandById as deleteBrandByIdService, getBrandImageById as getBrandImageByIdService, getBrandImageByName as getBrandImageByNameService, getAllBrandsIdentities as getAllBrandsIdentitiesService } from "../services/brand"
import { sendSuccessResponse } from "../middlewares/success";

export const getAllBrands = catchAsyncErrors(async (_: Request, res: Response) => {
  const brands = await getAllBrandsService();
  sendSuccessResponse(res, 200, "Brands fetched successfully", brands);
});

export const getAllBrandsIdentities = catchAsyncErrors(async (_: Request, res: Response) => {
  const brands = await getAllBrandsIdentitiesService();
  sendSuccessResponse(res, 200, "Brands fetched successfully", brands);
});

export const getBrandById = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await getBrandByIdService(parseInt(id));
  sendSuccessResponse(res, 200, "Brand fetched successfully", brand);
});

export const getBrandImageById = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brandImage = await getBrandImageByIdService(parseInt(id));
  res.sendFile(brandImage);
});

export const getBrandImageByName = catchAsyncErrors(async (req: Request, res: Response) => {
  const { name } = req.params;
  const brandImage = await getBrandImageByNameService(String(name));
  res.sendFile(brandImage);
});

export const createBrand = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const file = req.file
  const brand = await createBrandService(data, file!);
  sendSuccessResponse(res, 201, "Brand created successfully", brand);
});

export const updateBrand = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file
  const brand = await updateBrandService(parseInt(id), data, file!);
  sendSuccessResponse(res, 200, "Brand updated successfully", brand);
});

export const deleteBrand = catchAsyncErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteBrandByIdService(parseInt(id));
  sendSuccessResponse(res, 200, result.message);
});
