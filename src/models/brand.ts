import { DataTypes, Model, Sequelize } from "sequelize";
import { BrandAttributes, BrandCreationAttributes } from "../types/models";
import path from "path";
import fs from "fs";

export class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
  public id!: number;
  public name!: string;
  public imgUrl!: string | null | undefined;

  public toJSON(): object {
    const values: Partial<BrandAttributes> = { ...this.get() };
    return values;
  }
}

export default (sequelize: Sequelize) => {
  Brand.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      imgUrl: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      tableName: "brands",
      timestamps: false,
      indexes: [{ name: "name_index", unique: true, fields: ["name"] }],
      hooks: {
        beforeDestroy: async (brand: Brand) => {
          if (brand.imgUrl) {
            try {
              const imgPath = path.resolve(brand.imgUrl);
              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
            } catch (err) {
              console.log("Failed to delete brand image:", err);
            }
          }
        },
      },
    },
  );

  return Brand;
};
