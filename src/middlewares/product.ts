import { Product } from "../models/product"
import ErrorHandler from "./error"
import { Brand } from "../models/brand";
import { SubCategory } from "../models/subcategory";
import { Category } from "../models/category";
import { Rate } from "../models/rate";
import { WalletTransaction } from "../models/walletTransaction";
import { WALLET_TRANSACTION } from "../types/vars";
import { col, fn, Op } from "sequelize";

export const findProductById = async (id: number) => {
  const product = await Product.findByPk(id)

  if (!product)
    throw new ErrorHandler("Product not found", 404)

  return product
}

export const formatProduct = (product: any) => {
  const json = product.toJSON();

  const subCategories = json.subCategories || [];
  const category =
    subCategories.length > 0
      ? subCategories[0].category?.title
      : undefined;

  return {
    id: json.id,
    title: json.title,
    desc: json.desc,
    price: json.price,
    brand: json.brand?.name,
    category,
    subCategories: subCategories.map((sc: any) => ({
      id: sc.id,
      title: sc.title,
    })),
    rate: {
      average: json.averageRate
        ? Number(Number(json.averageRate).toFixed(1))
        : 0,
      count: Number(json.ratesCount || 0),
    },
  };
};

export const PRODUCT_FULL_INCLUDE = [
  {
    model: Brand,
    as: "brand",
    attributes: ["id", "name"],
  },
  {
    model: SubCategory,
    as: "subCategories",
    attributes: ["id", "title"],
    through: { attributes: [] },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "title"],
      },
    ],
  },
  {
    model: Rate,
    as: "rates",
    attributes: [],
    required: false,
  },
];

export const getPurchasesByDay = async (start: Date, end: Date) => {
  return WalletTransaction.findAll({
    attributes: [
      [fn("DAY", col("createdAt")), "day"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      type: WALLET_TRANSACTION.PURCHASE,
      createdAt: {
        [Op.between]: [start, end],
      },
    },
    group: [fn("DAY", col("createdAt"))],
    order: [[fn("DAY", col("createdAt")), "ASC"]],
    raw: true,
  });
};

export const fillMissingDays = (data: any[], year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const map = new Map<number, number>();
  data.forEach(d => map.set(Number(d.day), Number(d.count)));

  const result = [];
  for (let day = 1; day <= daysInMonth; day++) {
    result.push({
      day,
      count: map.get(day) || 0,
    });
  }

  return result;
};