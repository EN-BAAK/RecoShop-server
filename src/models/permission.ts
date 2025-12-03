import { DataTypes, Model, Sequelize } from "sequelize";
import { PermissionAttributes, PermissionCreationAttributes } from "../types/models";

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public userId!: number;
  public permissions!: number;

  static associate(models: any) {
    Permission.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" })
    models.User.hasOne(models.Permission, { foreignKey: "userId", onDelete: "CASCADE", as: "permission" });
  }
}

export default (sequelize: Sequelize) => {
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      permissions: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 63
        }
      },
    },
    {
      sequelize,
      tableName: "permissions",
      timestamps: true,
    }
  );

  return Permission;
};
