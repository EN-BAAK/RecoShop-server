import fs from "fs";
import path from "path";
import { Product } from "../models/product";
import { findSubCategoryById } from "../middlewares/subCategory";
import ErrorHandler from "../middlewares/error";
import { ProductCreationAttributes } from "../types/models";
import { findProductById } from "../middlewares/product";

export const getAllProducts = async () => {
  return Product.findAll({
    attributes: { exclude: ["imgUrl"] },
    include: [{ association: "category", attributes: ["title"] }],
    order: [["id", "DESC"]],
  });
};

export const getProductById = async (id: number) => {
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["imgUrl"] },
    include: [{ association: "category", attributes: ["title"] }],
  });

  if (!product) throw new ErrorHandler("Product not found", 404);
  return product;
};

export const getProductImage = async (id: number) => {
  const product = await findProductById(id);

  if (!product.imgUrl) throw new ErrorHandler("Image not found", 404);

  const filePath = path.resolve(product.imgUrl);
  if (!fs.existsSync(filePath)) throw new ErrorHandler("Image file missing", 404);

  return filePath;
};

export const createProduct = async (data: ProductCreationAttributes, image?: Express.Multer.File) => {
  await findSubCategoryById(data.categoryId);
  const imgUrl = image ? path.join("uploads/products", image.filename) : null;

  const product = await Product.create({
    ...data,
    imgUrl,
  });

  return product;
};

export const updateProduct = async (id: number, data: Partial<ProductCreationAttributes>, image?: Express.Multer.File) => {
  const product = await findProductById(id)

  if (data.categoryId) await findSubCategoryById(data.categoryId);

  if (image) {
    if (product.imgUrl && fs.existsSync(product.imgUrl)) fs.unlinkSync(product.imgUrl);
    product.imgUrl = path.join("uploads/products", image.filename);
  } else if (data.imgUrl === null) {
    if (product.imgUrl && fs.existsSync(product.imgUrl)) fs.unlinkSync(product.imgUrl);
    product.imgUrl = null;
  }

  if (data.title !== undefined) product.title = data.title;
  if (data.desc !== undefined) product.desc = data.desc;
  if (data.price !== undefined) product.price = data.price;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.categoryId !== undefined) product.categoryId = data.categoryId;

  await product.save();
  return product;
};

export const deleteProduct = async (id: number) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  await product.destroy();

  return { message: "Product deleted successfully" };
};
