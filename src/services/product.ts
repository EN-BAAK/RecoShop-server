import fs from "fs";
import path from "path";
import { Product } from "../models/product";
import { Brand } from "../models/brand";
import ErrorHandler from "../middlewares/error";
import { findBrandById } from "../middlewares/brand";
import { ProductCreationAttributes } from "../types/models";
import { findProductById, formatProductResponse } from "../middlewares/product";
import { isSubCategoriesRelatedToSameCategory } from "../controllers/subCategory";
import { SubCategory } from "../models/subcategory";
import { Category } from "../models/category";
import { Op } from "sequelize";
import { findCategoryByTitle } from "../middlewares/category";

export const getAllProducts = async (options?: { limit?: number; page?: number; offsetUnit?: number }) => {
  let { limit, page, offsetUnit } = options || {};
  limit = limit && limit > 0 ? limit : undefined;
  page = page && page > 0 ? page : 1;
  offsetUnit = offsetUnit && offsetUnit > 0 ? offsetUnit : 0;

  let offset = 0;
  if (limit) {
    offset = ((page - 1) * limit) + offsetUnit;
  }

  const { count, rows } = await Product.findAndCountAll({
    attributes: { exclude: ["imgUrl", "createdAt", "updatedAt"] },
    order: [["id", "DESC"]],
    include: [
      { model: Brand, as: "brand", attributes: ["id", "name"] },
      {
        model: SubCategory,
        as: "subCategories",
        attributes: ["id", "title", "categoryId"],
        through: { attributes: [] },
      },
    ],
    ...(limit ? { limit } : {}),
    ...(limit ? { offset } : {}),
    distinct: true,
  });

  const formattedProducts = [];
  for (const product of rows) {
    formattedProducts.push(await formatProductResponse(product));
  }

  return {
    products: formattedProducts,
    totalCount: count,
    totalPages: limit ? Math.ceil(count / limit) : 1,
    currentPage: page,
  };
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

export const getProductById = async (id: number) => {
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["imgUrl", "createdAt", "updatedAt"] },
    include: [
      {
        model: SubCategory,
        as: "subCategories",
        attributes: ["id", "title", "categoryId"],
        through: { attributes: [] },
      },
      {
        model: Brand,
        as: "brand",
        attributes: ["name"],
      }
    ],
  });

  if (!product) throw new ErrorHandler("Product not found", 404);

  return await formatProductResponse(product)
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
  await findBrandById(data.brandId);
  const imgUrl = image ? path.join("uploads/products", image.filename) : null;

  const product = await Product.create({
    ...data,
    imgUrl,
  });

  await product.setSubCategories(data.categories);

  const fullProduct = await Product.findByPk(product.id, {
    include: [
      { model: Brand, as: "brand", attributes: ["id", "name"] },
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
  if (data.brandId !== undefined) {
    await findBrandById(data.brandId);
    product.brandId = data.brandId;
  }

  await product.save();

  const fullProduct = await Product.findByPk(id, {
    include: [
      { model: Brand, as: "brand", attributes: ["id", "name"] },
      { model: SubCategory, as: "subCategories", attributes: ["id", "title", "categoryId"], through: { attributes: [] } }
    ]
  });

  return await formatProductResponse(fullProduct);
};

export const deleteProduct = async (id: number) => {
  const product = await findProductById(id);
  await product.destroy();

  return { message: "Product deleted successfully" };
};

export const getPaginatedProductsWithFiltering = async ({ search, category, limit, offset, }: { search?: string; category?: string; limit?: number; offset?: number; }) => {
  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  let categoryId: number | undefined = undefined;

  if (category)
    categoryId = (await findCategoryByTitle(category)).id;

  const include: any[] = [
    { model: Brand, as: "brand", attributes: ["name"] },
    {
      model: SubCategory,
      as: "subCategories",
      attributes: [],
      through: { attributes: [] },
      ...(categoryId && {
        where: { categoryId },
        required: true,
      }),
    },
  ];

  const products = await Product.findAll({
    where,
    include,
    subQuery: false,
    limit,
    offset,
    attributes: { exclude: ["imgUrl", "createdAt", "updatedAt", "brandId"] },
    order: [["id", "DESC"]],
  });

  const result = [];
  for (const product of products) {
    const json = product.toJSON() as any;

    result.push({
      ...json,
      subCategories: undefined,
      category: undefined,
      brand: json.brand.name,
    });
  }


  return result;
};
