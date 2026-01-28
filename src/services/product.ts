import fs from "fs";
import path from "path";
import { Product } from "../models/product";
import { Brand } from "../models/brand";
import ErrorHandler from "../middlewares/error";
import { findBrandById } from "../middlewares/brand";
import { ProductCreationAttributes } from "../types/models";
import { findProductById, PRODUCT_FULL_INCLUDE, formatProduct, getPurchasesByDay, fillMissingDays } from "../middlewares/product";
import { isSubCategoriesRelatedToSameCategory } from "../controllers/subCategory";
import { SubCategory } from "../models/subcategory";
import { Category } from "../models/category";
import { col, fn, literal, Op } from "sequelize";
import { findCategoryByTitle } from "../middlewares/category";
import { BillProduct } from "../models/billProduct";
import { Rate } from "../models/rate";

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
    attributes: {
      exclude: ["imgUrl", "createdAt", "updatedAt"],
      include: [
        [fn("AVG", col("rates.rate")), "averageRate"],
        [fn("COUNT", col("rates.id")), "ratesCount"],
      ],
    },
    include: PRODUCT_FULL_INCLUDE,
    group: ["Product.id", "brand.id", "subCategories.id", "subCategories->category.id"],
    order: [["id", "DESC"]],
    ...(limit ? { limit, offset } : {}),
    distinct: true,
    subQuery: false,
  });

  return {
    products: rows.map(formatProduct),
    totalCount: count.length,
    totalPages: limit ? Math.ceil(count.length / limit) : 1,
    currentPage: page,
  };
};

export const getMostPurchasedProductWithDetails = async () => {
  const product = await Product.findOne({
    include: [
      ...PRODUCT_FULL_INCLUDE.filter(
        (inc: any) => inc.as !== "rates"
      ),

      {
        model: BillProduct,
        as: "billItems",
        attributes: [],
        required: true,
      },

      {
        model: Rate,
        as: "rates",
        attributes: [],
        required: false,
      },
    ],

    attributes: {
      include: [
        [fn("SUM", col("billItems.quantity")), "totalQuantity"],
        [fn("AVG", col("rates.rate")), "averageRate"],
        [fn("COUNT", col("rates.id")), "ratesCount"],
      ],
    },

    group: [
      "Product.id",
      "brand.id",
      "subCategories.id",
      "subCategories->category.id",
    ],

    order: [[literal("totalQuantity"), "DESC"]],
    subQuery: false,
  });

  return product ? formatProduct(product) : null;
};

export const getPurchasedProductsByMonth = async () => {
  const now = new Date();

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthRaw = await getPurchasesByDay(
    startOfCurrentMonth,
    now
  );

  const lastMonthRaw = await getPurchasesByDay(
    startOfLastMonth,
    endOfLastMonth
  );

  const currentMonth = fillMissingDays(
    currentMonthRaw,
    now.getFullYear(),
    now.getMonth()
  );

  const lastMonth = fillMissingDays(
    lastMonthRaw,
    startOfLastMonth.getFullYear(),
    startOfLastMonth.getMonth()
  );

  const purchases = {
    currentMonth,
    lastMonth
  }

  return purchases
}

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
    attributes: {
      exclude: ["imgUrl", "createdAt", "updatedAt"],
      include: [
        [fn("AVG", col("rates.rate")), "averageRate"],
        [fn("COUNT", col("rates.id")), "ratesCount"],
      ],
    },
    include: PRODUCT_FULL_INCLUDE,
    group: ["Product.id", "brand.id", "subCategories.id", "subCategories->category.id"],
  });

  if (!product) throw new ErrorHandler("Product not found", 404);

  return formatProduct(product);
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

  return await formatProduct(fullProduct);
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

  return await formatProduct(fullProduct);
};

export const deleteProduct = async (id: number) => {
  const product = await findProductById(id);
  await product.destroy();

  return { message: "Product deleted successfully" };
};

export const getPaginatedProductsWithFiltering = async ({ search, category, limit, page = 1, }: { search?: string; category?: string; limit?: number; page?: number; }) => {
  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  let categoryId: number | undefined;
  if (category) {
    const cat = await findCategoryByTitle(category);
    categoryId = cat?.id;
  }

  const offset = limit && limit > 0 ? (page - 1) * limit : undefined;

  const { count, rows: products } = await Product.findAndCountAll({
    where,
    include: [
      ...PRODUCT_FULL_INCLUDE.map((inc) => ({
        ...inc,
        ...(inc.as === "subCategories" && categoryId
          ? { where: { categoryId }, required: true }
          : {}),
      })),
    ],
    attributes: {
      exclude: ["imgUrl", "createdAt", "updatedAt"],
      include: [
        [fn("AVG", col("rates.rate")), "averageRate"],
        [fn("COUNT", col("rates.id")), "ratesCount"],
      ],
    },
    group: [
      "Product.id",
      "brand.id",
      "subCategories.id",
      "subCategories->category.id",
    ],
    order: [["id", "DESC"]],
    ...(limit ? { limit, offset } : {}),
    distinct: true,
    subQuery: false,
  });

  return {
    products: products.map(formatProduct),
    totalCount: count.length,
    totalPages: limit ? Math.ceil(count.length / limit) : 1,
    currentPage: page,
  };
};


export const getRelatedProducts = async (id: number) => {
  const baseProduct = await Product.findByPk(id, {
    include: [{ model: SubCategory, as: "subCategories", attributes: ["categoryId"] }],
  });

  if (!baseProduct) throw new ErrorHandler("Product not found", 404);

  const categoryId = (baseProduct.toJSON() as any).subCategories?.[0]?.categoryId;
  if (!categoryId) return [];

  const products = await Product.findAll({
    where: { id: { [Op.ne]: id } },
    include: PRODUCT_FULL_INCLUDE,
    attributes: {
      include: [
        [fn("AVG", col("rates.rate")), "averageRate"],
        [fn("COUNT", col("rates.id")), "ratesCount"],
      ],
    },
    group: ["Product.id", "brand.id", "subCategories.id", "subCategories->category.id"],
    limit: 5,
    order: [["id", "DESC"]],
  });

  return products.map(formatProduct);
};

