import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryAttributes, CategoryCreationAttributes } from "../types/models";

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;

  public toJSON(): object {
    const values: Partial<CategoryAttributes> = { ...this.get() };
    return values;
  }
}

export default (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: false,
      indexes: [{ name: "title_index", unique: true, fields: ["title"] }],
    },
  );

  return Category;
};
