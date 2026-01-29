import { DataTypes, Model, Sequelize } from "sequelize";
import { BranchAttributes, BranchCreationAttributes } from "../types/models";

export class Branch extends Model<BranchAttributes, BranchCreationAttributes> implements BranchAttributes {
  public id!: number;
  public name!: string;
  public location?: string;
  public facebook?: string;
  public instagram?: string;
  public phone?: string;
  public telephone?: string;
  public groupId?: number;

  public toJSON(): object {
    const values: Partial<BranchAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    Branch.belongsTo(models.GroupBranch, {
      foreignKey: "groupId",
      as: "groupBranch",
      onDelete: "CASCADE",
    });

    models.GroupBranch.hasMany(Branch, {
      foreignKey: "groupId",
      as: "branches",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}

export default (sequelize: Sequelize) => {
  Branch.init(
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
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "groupBranches", key: "id" },
      },
    },
    {
      sequelize,
      tableName: "branches",
      timestamps: false,
    }
  );

  return Branch;
};
