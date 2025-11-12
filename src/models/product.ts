import { DataTypes, Model, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { ProductAttributes, ProductCreationAttributes } from "../types/models";

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;
  public price!: number;
  public imgUrl!: string | undefined | null;
  public brand!: string;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Product.belongsTo(models.SubCategory, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "CASCADE",
    });

    models.SubCategory.hasMany(Product, {
      foreignKey: "categoryId",
      as: "product",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true,
      indexes: [{ name: "title_index", unique: false, fields: ["title"] }],
      hooks: {
        beforeDestroy: async (product: Product) => {
          if (product.imgUrl) {
            try {
              const imgPath = path.resolve(product.imgUrl);
              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
            } catch (err) {
              console.log("Failed to delete product image:", err);
            }
          }
        },
      },
    }
  );

  return Product;
};
