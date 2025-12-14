import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/models";
import { comparePassword, hashPassword } from "../utils/encrypt";
import { GOVERNORATE, SEX } from "../types/vars";

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public gender!: SEX;
  public password!: string;
  public governorate!: GOVERNORATE;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async checkPassword(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }

  public toJSON(): object {
    const values: Partial<UserAttributes> = { ...this.get() };
    delete values.password;
    return values;
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING, allowNull: false },
      governorate: { type: DataTypes.ENUM(...Object.values(GOVERNORATE)), allowNull: false },
      gender: { type: DataTypes.ENUM(...Object.values(SEX)), allowNull: false, defaultValue: SEX.MALE },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      indexes: [{ name: "name_index", unique: false, fields: ["firstName", "lastName"] }],
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) user.password = await hashPassword(user.password);
        },
        beforeSave: async (user: User) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
          }
        },
        afterCreate: async (user: User) => {
          const sequelize = user.sequelize;
          if (!sequelize) return;

          const Wallet = sequelize.models.Wallet;

          await Wallet.create({
            userId: user.id,
            balance: 0,
          });
        },
      },
    }
  );

  return User;
};