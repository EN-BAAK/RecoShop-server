import { DataTypes, Model, Sequelize } from "sequelize";
import { CommentAttributes, CommentCreationAttributes } from "../types/models";

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public comment!: string;
  public readonly createdAt!: Date;

  public toJSON(): object {
    const values: Partial<CommentAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Comment.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    models.User.hasMany(Comment, {
      foreignKey: "userId",
      as: "comments",
    });

    models.Product.hasMany(Comment, {
      foreignKey: "productId",
      as: "comments",
    });
  }
}

export default (sequelize: Sequelize) => {
  Comment.init(
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
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "comments",
      timestamps: true,
      updatedAt: false,
    }
  );

  return Comment;
};
