import { User } from "../models/user";
import { UnverifiedUser } from "../models/unverifiedUser";
import { Op } from "sequelize";
import { findUserById } from "../middlewares/user";

export const getAllUsers = async (isVerified?: boolean, excludeId?: number) => {
  const whereClause: any = {};

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  let includeUnverified: any = {
    model: UnverifiedUser,
    as: "unverified",
    attributes: ["id"],
    required: false,
  };

  if (isVerified === true) {
    whereClause["$unverified.id$"] = null;
  }

  else if (isVerified === false) {
    includeUnverified.required = true
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: [includeUnverified],
  });

  return users.map((user) => {
    const u = user.toJSON() as any;

    return {
      ...u,
      isVerified: !u.unverified,
      unverified: undefined,
    };
  });
};

// export const getUserById = async (id: number) => {
//   return await User.findByPk(id, {
//     include: [{ model: UnverifiedUser, as: "unverified" }],
//   });
// };

// export const getProfile = async (id: number) => {
//   return await User.findByPk(id, {
//     include: [{ model: UnverifiedUser, as: "unverified" }],
//   });
// };

export const deleteUser = async (id: number) => {
  const user = await findUserById(id);
  await user.destroy();
  return { msg: "User deleted successfully" };
};

