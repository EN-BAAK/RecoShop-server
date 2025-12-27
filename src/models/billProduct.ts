import { DataTypes, Model, Sequelize } from "sequelize";
import { BillProductAttributes, BillProductCreationAttributes } from "../types/models";

export class BillProduct extends Model<BillProductAttributes, BillProductCreationAttributes> implements BillProductAttributes {
  public id!: number;
  public billId!: number;
  public productId?: number;
  public quantity!: number;

  static associate(models: any) {
    BillProduct.belongsTo(models.Bill, {
      foreignKey: "billId",
      as: "bill",
      onDelete: "CASCADE",
    });

    BillProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
      onDelete: "SET NULL",
    });

    models.Bill.hasMany(models.BillProduct, {
      foreignKey: "billId",
      as: "items",
      onDelete: "CASCADE",
    });

    models.Product.hasMany(models.BillProduct, {
      foreignKey: "productId",
      as: "billItems",
      onDelete: "SET NULL",
    });
  }
}

export default (sequelize: Sequelize) => {
  BillProduct.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      billId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "bills", key: "id" },
        onDelete: "CASCADE",
      },
      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "products", key: "id" },
        onDelete: "SET NULL",
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "bill_products",
      timestamps: false,
    }
  );

  return BillProduct;
};
