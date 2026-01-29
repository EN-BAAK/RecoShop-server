import { GroupBranch } from "../models/groupBranch"
import ErrorHandler from "./error"

export const findGroupBranchById = async (id: number) => {
  const group = await GroupBranch.findByPk(id)
  if (!group)
    throw new ErrorHandler("Group Branch not found", 404)

  return group;
}