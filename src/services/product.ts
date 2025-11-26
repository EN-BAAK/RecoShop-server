import fs from "fs";
import path from "path";
import { Product } from "../models/product";
import ErrorHandler from "../middlewares/error";
import { ProductCreationAttributes } from "../types/models";
import { findProductById, formatProductResponse } from "../middlewares/product";
import { isSubCategoriesRelatedToSameCategory } from "../controllers/subCategory";
import { SubCategory } from "../models/subcategory";
import { Category } from "../models/category";

export const getAllProducts = async () => {
  const products = await Product.findAll({
    attributes: { exclude: ["imgUrl", "createdAt", "updatedAt"] },
    order: [["id", "DESC"]],
    include: [
      {
        model: SubCategory,
        as: "subCategories",
        attributes: ["id", "title", "categoryId"],
        through: { attributes: [] },
      },
    ],
  });

  const result = [];

  for (const product of products) {
    result.push(await formatProductResponse(product));
  }

  return result;
};

export const getProductSettingsById = async (id: number) => {
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["imgUrl", "createdAt", "updatedAt"] },
    include: [
      {
        model: SubCategory,
        as: "subCategories",
        attributes: ["id", "title", "categoryId"],
        through: { attributes: [] },
      },
    ],
  });

  if (!product) throw new ErrorHandler("Product not found", 404);

  const json = product.toJSON() as any;

  const subCats = json.subCategories || [];

  const category =
    subCats.length > 0
      ?
      await Category.findByPk(subCats[0].categoryId, { attributes: ["title"] })
      : undefined;

  const cleanSubCats = subCats.map((sc: any) => (String(sc.id)));

  return {
    ...json,
    subCategories: undefined,
    category: category?.title,
    categories: cleanSubCats,
  };
};

export const getProductImage = async (id: number) => {
  const product = await findProductById(id);

  if (!product.imgUrl) throw new ErrorHandler("Image not found", 404);

  const filePath = path.resolve(product.imgUrl);
  if (!fs.existsSync(filePath)) throw new ErrorHandler("Image file missing", 404);

  return filePath;
};

export const createProduct = async (
  data: ProductCreationAttributes & { categories: number[] },
  image?: Express.Multer.File
) => {
  await isSubCategoriesRelatedToSameCategory(data.categories);
  const imgUrl = image ? path.join("uploads/products", image.filename) : null;

  const product = await Product.create({
    ...data,
    imgUrl,
  });

  await product.setSubCategories(data.categories);

  const fullProduct = await Product.findByPk(product.id, {
    include: [
      { model: SubCategory, as: "subCategories", attributes: ["id", "title", "categoryId"], through: { attributes: [] } }
    ]
  });

  return await formatProductResponse(fullProduct);
};

export const updateProduct = async (
  id: number,
  data: Partial<ProductCreationAttributes> & { removeImage?: boolean; categories?: number[] },
  image?: Express.Multer.File
) => {
  const product = await findProductById(id);

  if (image) {
    if (product.imgUrl && fs.existsSync(product.imgUrl)) fs.unlinkSync(product.imgUrl);
    product.imgUrl = path.join("uploads/products", image.filename);
  } else if (data.removeImage) {
    if (product.imgUrl && fs.existsSync(product.imgUrl)) fs.unlinkSync(product.imgUrl);
    product.imgUrl = null;
  }

  if (data.categories?.length) {
    await isSubCategoriesRelatedToSameCategory(data.categories);

    await product.setSubCategories([]);
    await product.setSubCategories(data.categories);
  }

  if (data.title !== undefined) product.title = data.title;
  if (data.desc !== undefined) product.desc = data.desc;
  if (data.price !== undefined) product.price = data.price;
  if (data.brand !== undefined) product.brand = data.brand;

  await product.save();

  const fullProduct = await Product.findByPk(id, {
    include: [
      { model: SubCategory, as: "subCategories", attributes: ["id", "title", "categoryId"], through: { attributes: [] } }
    ]
  });

  return await formatProductResponse(fullProduct);
};

export const deleteProduct = async (id: number) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  await product.destroy();

  return { message: "Product deleted successfully" };
};
