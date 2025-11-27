import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { ProductAttributes, ProductCreationAttributes } from "../types/models";
import { SubCategory } from "./subcategory";

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;
  public price!: number;
  public imgUrl!: string | undefined | null;
  public brandId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setSubCategories!: BelongsToManySetAssociationsMixin<SubCategory, number>;

  static associate(models: any) {
    Product.belongsToMany(models.SubCategory, {
      through: "ProductSubCategories",
      foreignKey: "productId",
      otherKey: "subCategoryId",
      as: "subCategories"
    });
    Product.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
    });

    models.Brand.hasMany(Product, {
      foreignKey: "brandId",
      as: "products",
      onDelete: "CASCADE",
      hooks: true,
    });

    models.SubCategory.belongsToMany(Product, {
      through: "ProductSubCategories",
      foreignKey: "subCategoryId",
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
      brandId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "brands", key: "id" },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
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
