import path from "path";
import { findBrandById, findBrandByName } from "../middlewares/brand";
import ErrorHandler from "../middlewares/error";
import { Brand } from "../models/brand";
import fs from "fs";
import { BrandCreationAttributes } from "../types/models";

export const getAllBrands = async () => {
  return Brand.findAll({
    order: [["id", "DESC"]],
    attributes: { exclude: ["imgUrl"] },
  });
};

export const getAllBrandsIdentities = async () => {
  return Brand.findAll({
    order: [["id", "DESC"]],
    attributes: ["id", "title"],
  });
};

export const getBrandById = async (id: number) => {
  const brand = findBrandById(id)
  return brand
}

export const getBrandImageById = async (id: number) => {
  const brand = await findBrandById(id);

  if (!brand.imgUrl) throw new ErrorHandler("Image not found", 404);

  const filePath = path.resolve(brand.imgUrl);
  if (!fs.existsSync(filePath)) throw new ErrorHandler("Image file missing", 404);

  return filePath;
};

export const getBrandImageByName = async (name: string) => {
  const brand = await findBrandByName(name);

  if (!brand.imgUrl) throw new ErrorHandler("Image not found", 404);

  const filePath = path.resolve(brand.imgUrl);
  if (!fs.existsSync(filePath)) throw new ErrorHandler("Image file missing", 404);

  return filePath;
};

export const createBrand = async (
  data: BrandCreationAttributes,
  image?: Express.Multer.File
) => {
  const imgUrl = image ? path.join("uploads/brands", image.filename) : null;

  const brand = await Brand.create({
    ...data,
    imgUrl,
  });

  return brand.toJSON();
};

export const updateBrand = async (
  id: number,
  data: Partial<BrandCreationAttributes> & { removeImage?: boolean },
  image?: Express.Multer.File
) => {
  const brand = await findBrandById(id);

  if (image) {
    if (brand.imgUrl && fs.existsSync(brand.imgUrl)) fs.unlinkSync(brand.imgUrl);
    brand.imgUrl = path.join("uploads/brands", image.filename);
  } else if (data.removeImage) {
    if (brand.imgUrl && fs.existsSync(brand.imgUrl)) fs.unlinkSync(brand.imgUrl);
    brand.imgUrl = null;
  }

  if (data.name !== undefined) brand.name = data.name;

  await brand.save();

  return brand.toJSON();
};

export const deleteBrandById = async (id: number) => {
  const brand = await findBrandById(id)

  await brand.destroy();
  return { message: "Brand deleted successfully" };
};