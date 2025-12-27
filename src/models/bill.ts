import { DataTypes, Model, Sequelize } from "sequelize";
import { BillAttributes, BillCreationAttributes } from "../types/models";

export class Bill extends Model<BillAttributes, BillCreationAttributes> implements BillAttributes {
  public id!: number;
  public walletTransactionId!: number;
  public readonly createdAt!: Date;

  static associate(models: any) {
    Bill.belongsTo(models.WalletTransaction, {
      foreignKey: "walletTransactionId",
      as: "transaction",
      onDelete: "CASCADE",
    });

    models.WalletTransaction.hasOne(models.WalletTransaction, {
      foreignKey: "walletTransactionId",
      as: "transaction",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Bill.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      walletTransactionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "bills",
      timestamps: true,
      updatedAt: false,
    }
  );

  return Bill;
};
