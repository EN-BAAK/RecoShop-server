import { DataTypes, Model, Sequelize } from "sequelize";
import { WalletAttributes, WalletCreationAttributes } from "../types/models";

export class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes {

  public id!: number;
  public userId!: number;
  public balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public toJSON(): object {
    const values: Partial<WalletAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    Wallet.belongsTo(models.User, {
      foreignKey: "userId",
      as: "wallet",
      onDelete: "CASCADE",
    });

    models.User.hasOne(Wallet, {
      foreignKey: "userId",
      as: "wallet",
      onDelete: "CASCADE",
    });

    Wallet.hasMany(models.WalletTransaction, {
      foreignKey: "walletId",
      as: "transactions",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Wallet.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      tableName: "wallets",
      timestamps: true,
    }
  );

  return Wallet;
};
