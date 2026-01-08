import { DataTypes, Model, Sequelize } from "sequelize";
import { RateAttributes, RateCreationAttributes } from "../types/models";

export class Rate
  extends Model<RateAttributes, RateCreationAttributes>
  implements RateAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public rate!: number;

  public toJSON(): object {
    const values: Partial<RateAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    Rate.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Rate.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    models.User.hasMany(Rate, {
      foreignKey: "userId",
      as: "rates",
    });

    models.Product.hasMany(Rate, {
      foreignKey: "productId",
      as: "rates",
    });
  }
}

export default (sequelize: Sequelize) => {
  Rate.init(
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
      rate: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      tableName: "rates",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userId", "productId"],
        },
      ],
    }
  );

  return Rate;
};
