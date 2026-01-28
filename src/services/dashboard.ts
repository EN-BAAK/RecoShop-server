import { Op } from "sequelize";
import { Product } from "../models/product";
import { UnverifiedUser } from "../models/unverifiedUser";
import { User } from "../models/user";
import { Brand } from "../models/brand";

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

  return {
    totalUnverifiedUsers,
    totalVerifiedUsers,
    totalProducts,
    totalBrands,
  };
}