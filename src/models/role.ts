import { DataTypes, Model, Sequelize } from "sequelize";
import { RoleAttributes, RoleCreationAttributes } from "../types/models";

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public userId!: number;
  public role!: number;

  static associate(models: any) {
    Role.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" })
    models.User.hasOne(models.Role, { foreignKey: "userId", onDelete: "CASCADE", as: "role" });
  }
}

export default (sequelize: Sequelize) => {
  Role.init(
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
      role: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 15
        }
      },
    },
    {
      sequelize,
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
