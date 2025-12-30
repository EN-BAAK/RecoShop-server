import { col, fn, literal, Op } from "sequelize";
import { Product } from "../models/product";
import { UnverifiedUser } from "../models/unverifiedUser";
import { User } from "../models/user";
import { Brand } from "../models/brand";
import { Permission } from "../models/permission";
import { ROLES } from "../constants/globals";
import { getClosestRole } from "../middlewares/auth";
import { WALLET_TRANSACTION } from "../types/vars";
import { WalletTransaction } from "../models/walletTransaction";
import { BillProduct } from "../models/billProduct";

const getPurchasesByDay = async (start: Date, end: Date) => {
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

const fillMissingDays = (data: any[], year: number, month: number) => {
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

const getMostPurchasedProductWithDetails = async () => {
  const result = await BillProduct.findOne({
    attributes: [
      "productId",
      [fn("SUM", col("quantity")), "totalQuantity"],
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "desc"],
      },
    ],
    group: ["productId", "product.id"],
    order: [[literal("totalQuantity"), "DESC"]],
  });

  return result;
};

export const getDashboardData = async () => {
  const totalUnverifiedUsers = await UnverifiedUser.count();
  const totalVerifiedUsers = await User.count({
    include: [
      {
        model: UnverifiedUser,
        as: "unverified",
        required: false,
        attributes: [],
      },
    ],
    where: {
      "$unverified.id$": {
        [Op.is]: null,
      },
    },
  });

  const totalProducts = await Product.count();
  const totalBrands = await Brand.count();

  const adminsAndManagers = await User.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Permission,
        as: "permission",
        where: {
          permissions: {
            [Op.in]: [ROLES.ADMIN, ROLES.MANAGER],
          },
        },
      },
    ],
  });

  const adminsAndManagersJson = adminsAndManagers.map((user) => user.toJSON() as any);
  adminsAndManagersJson.forEach((user) => {
    user.role = getClosestRole(user.permission.permissions);
    delete user.permission
  })

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

  const mostPurchasedProduct = await getMostPurchasedProductWithDetails();
  const mostPurchasedProductJson = mostPurchasedProduct?.toJSON() as any

  return {
    totalUnverifiedUsers,
    totalVerifiedUsers,
    totalProducts,
    totalBrands,
    adminsAndManagers: adminsAndManagersJson,
    purchases: {
      currentMonth,
      lastMonth,
    },
    mostPurchasedProduct: {
      ...mostPurchasedProductJson.product,
      totalQuantity: mostPurchasedProductJson.totalQuantity,
    }
  };
}