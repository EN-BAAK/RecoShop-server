import { Branch } from "../models/branch";
import ErrorHandler from "./error";

export const findBranchById = async (id: number) => {
  const branch = await Branch.findByPk(id);

  if (!branch)
    throw new ErrorHandler("Branch not found", 404);

  return branch;
}