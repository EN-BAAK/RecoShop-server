import { DataTypes, Model, Sequelize } from "sequelize";
import { SubCategoryAttributes, SubCategoryCreationAttributes } from "../types/models";

export class SubCategory extends Model<SubCategoryAttributes, SubCategoryCreationAttributes> implements SubCategoryAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;
  public categoryId!: number;

  public toJSON(): object {
    const values: Partial<SubCategoryAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    SubCategory.belongsTo(models.Category, { foreignKey: "categoryId", as: "category", onDelete: "CASCADE" });
    models.Category.hasMany(SubCategory, { foreignKey: "categoryId", as: "subCategory" });
  }
}

export default (sequelize: Sequelize) => {
  SubCategory.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
    },
    {
      sequelize,
      tableName: "sub-categories",
      timestamps: false,
      indexes: [{ name: "title_index", unique: true, fields: ["title"] }],
    },
  );

  return SubCategory;
};
