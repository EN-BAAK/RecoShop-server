import { User } from "../models/user";
import { UnverifiedUser } from "../models/unverifiedUser";
import { Op } from "sequelize";
import { findUserById } from "../middlewares/user";
import { Permission } from "../models/permission";
import ErrorHandler from "../middlewares/error";
import { getClosestRole } from "../middlewares/auth";
import { Wallet } from "../models/wallet";
import { ROLES } from "../constants/globals";

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

export const getAdminsAndManagers = async () => {
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

  return adminsAndManagersJson;
}

export const getOwnProfile = async (userId: number) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Permission,
        as: "permission",
        attributes: ["permissions"],
      },
      {
        model: Wallet,
        as: "wallet",
        attributes: ["balance"]
      }
    ],
  });

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const json = user.toJSON() as any;

  const role = getClosestRole(json.permission?.permissions ?? 0);

  return {
    id: json.id,
    firstName: json.firstName,
    lastName: json.lastName,
    email: json.email,
    phone: json.phone,
    governorate: json.governorate,
    gender: json.gender,
    role,
    balance: json.wallet.balance
  };
};

export const getUserProfile = async (userId: number) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Permission,
        as: "permission",
        attributes: ["permissions"],
      },
      {
        model: UnverifiedUser,
        as: "unverified",
        attributes: ["id"],
        required: false,
      }
    ],
  });

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const json = user.toJSON() as any;

  const role = getClosestRole(json.permission?.permissions ?? 0);
  const isVerified = !json.unverified

  return {
    id: json.id,
    firstName: json.firstName,
    lastName: json.lastName,
    email: json.email,
    phone: json.phone,
    governorate: json.governorate,
    gender: json.gender,
    role,
    isVerified
  };
};

export const deleteUser = async (id: number) => {
  const user = await findUserById(id);
  await user.destroy();
  return { msg: "User deleted successfully" };
};

