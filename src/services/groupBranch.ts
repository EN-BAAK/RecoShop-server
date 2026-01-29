import { GroupBranch } from "../models/groupBranch";
import { findGroupBranchById } from "../middlewares/groupBranch";
import { GroupBranchCreationAttributes } from "../types/models";

export const getAllGroupBranches = async () => {
  const groupBranch = await GroupBranch.findAll();
  return groupBranch;
};

export const getGroupBranchById = async (id: number) => {
  const groupBranch = await findGroupBranchById(id)
  return groupBranch;
};

export const createGroupBranch = async (data: GroupBranchCreationAttributes) => {
  const groupBranch = await GroupBranch.create(data);
  return groupBranch;
};

export const updateGroupBranch = async (id: number, data: GroupBranchCreationAttributes) => {
  const groupBranch = await findGroupBranchById(id);
  Object.assign(groupBranch, data);

  await groupBranch.save();
  return groupBranch;
};

export const deleteGroupBranch = async (id: number) => {
  const groupBranch = await findGroupBranchById(id);
  await groupBranch.destroy();
};
