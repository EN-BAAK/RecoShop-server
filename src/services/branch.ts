import { Branch } from "../models/branch";
import { GroupBranch } from "../models/groupBranch";
import { findBranchById } from "../middlewares/branch";
import { BranchCreationAttributes } from "../types/models";

export const getBranches = async () => {
  const branches = await Branch.findAll({
    include: [{ model: GroupBranch, as: "groupBranch", attributes: ["name"] }],
  });
  return branches.map((branch: any) => {
    const json = branch.toJSON();

    return {
      ...json,
      groupId: undefined,
      group: json.groupBranch ? json.groupBranch.name : null,
      groupBranch: undefined,
    };
  });
};

export const getBranchById = async (id: number) => {
  const branch = await findBranchById(id)

  const json = branch.toJSON();
  return json;
};

export const createBranch = async (data: BranchCreationAttributes) => {
  const branch = await Branch.create(data);
  let group = undefined
  if (branch.groupId)
    group = await GroupBranch.findByPk(data.groupId);

  return await {
    ...branch.toJSON(),
    groupId: undefined,
    group: group ? group.name : null,
  };
};

export const updateBranch = async (
  id: number,
  data: Partial<BranchCreationAttributes>
) => {
  const branch = await findBranchById(id)

  Object.assign(branch, data);
  await branch.save();

  let group = undefined
  if (branch.groupId)
    group = await GroupBranch.findByPk(branch.groupId);

  return await {
    ...branch.toJSON(),
    groupId: undefined,
    group: group ? group.name : null,
  };
};

export const deleteBranch = async (id: number) => {
  const branch = await findBranchById(id)
  await branch.destroy();
};
