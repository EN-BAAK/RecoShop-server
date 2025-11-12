import { Role } from "../models/rule";
import { User } from "../models/user";
import ErrorHandler from "./error";

export const findUserById = async (id: number, transaction?: any) => {
  const user = await User.findByPk(id, { transaction });

  if (!user)
    throw new ErrorHandler("User not found", 404);

  return user;
}

export const findUserByEmail = async (email: string, transaction?: any) => {
  const user = await User.findOne({ where: { email }, transaction });

  if (!user)
    throw new ErrorHandler("User not found", 404);

  return user;
}

export const findUserByIdWithRole = async (id: number, transaction?: any) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["role"],
      },
    ],
    transaction
  });

  if (!user)
    throw new ErrorHandler("User not found", 404);

  const json = user.toJSON() as any

  const data = {
    ...json,
    role: json.role.role
  }

  return data;
};