import { DataTypes, Model, Sequelize } from "sequelize";
import { GroupBranchAttributes, GroupBranchCreationAttributes } from "../types/models";

export class GroupBranch extends Model<GroupBranchAttributes, GroupBranchCreationAttributes> implements GroupBranchAttributes {
  public id!: number;
  public name!: string;
}

export default (sequelize: Sequelize) => {
  GroupBranch.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "groupBranches",
      timestamps: false,
    }
  );

  return GroupBranch;
};
