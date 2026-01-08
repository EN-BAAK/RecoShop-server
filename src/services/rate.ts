import { Rate } from "../models/rate";
import { findProductById } from "../middlewares/product";
import { Sequelize } from "sequelize";

export const addOrUpdateRate = async (data: {
  userId: number;
  productId: number;
  rate: number;
}) => {
  await findProductById(data.productId);

  const existingRate = await Rate.findOne({
    where: {
      userId: data.userId,
      productId: data.productId,
    },
  });

  if (existingRate) {
    existingRate.rate = data.rate;
    await existingRate.save();
    return existingRate;
  }

  const rate = await Rate.create(data);
  return rate;
};

export const getProductRateStats = async (productId: number) => {
  await findProductById(productId);

  const result = await Rate.findOne({
    where: { productId },
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("rate")), "averageRate"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "ratesCount"],
    ],
    raw: true,
  });

  const resultJson = result as any

  return {
    averageRate: resultJson?.averageRate
      ? Number(Number(resultJson.averageRate).toFixed(1))
      : 0,
    ratesCount: Number(resultJson?.ratesCount || 0),
  };
};

export const getMyRateForProduct = async (
  userId: number,
  productId: number
) => {
  await findProductById(productId);

  const rate = await Rate.findOne({
    where: {
      userId,
      productId,
    },
  });

  return rate;
};
