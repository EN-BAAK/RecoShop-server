import { DataTypes, Model, Sequelize } from "sequelize";
import { ResetPasswordCreationRequestAttributes, ResetPasswordRequestAttributes } from "../types/models";

export class ResetPasswordRequest
  extends Model<ResetPasswordRequestAttributes, ResetPasswordCreationRequestAttributes>
  implements ResetPasswordRequestAttributes {
  public id!: number;
  public userId!: number;
  public code!: string;
  public expire!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    ResetPasswordRequest.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
    models.User.hasOne(ResetPasswordRequest, { foreignKey: "userId", as: "passwordResetRequest" });
  }
}

export default (sequelize: Sequelize) => {
  ResetPasswordRequest.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "reset_password_requests",
      timestamps: true,
    }
  );

  return ResetPasswordRequest;
};
