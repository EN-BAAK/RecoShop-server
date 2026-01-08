import { DataTypes, Model, Sequelize } from "sequelize";
import { ReviewAttributes, ReviewCreationAttributes } from "../types/models";

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public userId!: number;
  productId!: number;
  public readonly createdAt!: Date;

  public toJSON(): object {
    const values: Partial<ReviewAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    Review.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Review.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
    models.User.hasMany(Review, {
      foreignKey: "userId",
      as: "reviews",
    })
    models.Product.hasMany(Review, {
      foreignKey: "productId",
      as: "reviews",
    })
  }
}

export default (sequelize: Sequelize) => {
  Review.init(
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
      },
      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "products", key: "id" },
      }
    },
    {
      sequelize,
      tableName: "reviews",
      timestamps: true,
      updatedAt: false
    }
  );

  return Review;
};