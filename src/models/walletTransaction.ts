import { DataTypes, Model, Sequelize } from "sequelize";
import { WalletTransactionAttributes, WalletTransactionCreationAttributes } from "../types/models";
import { WALLET_TRANSACTION } from "../types/vars";

export class WalletTransaction
  extends Model<WalletTransactionAttributes, WalletTransactionCreationAttributes>
  implements WalletTransactionAttributes {

  public id!: number;
  public walletId!: number;
  public amount!: number;
  public type!: WALLET_TRANSACTION;
  public reason?: string;

  public readonly createdAt!: Date;

  static associate(models: any) {
    WalletTransaction.belongsTo(models.Wallet, {
      foreignKey: "walletId",
      as: "wallet",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  WalletTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      walletId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(WALLET_TRANSACTION)),
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "wallet_transactions",
      timestamps: true,
      updatedAt: false,
    }
  );

  return WalletTransaction;
};
