import { DataTypes, Model, Sequelize } from "sequelize";
import { MessageAttributes, MessageCreationAttributes } from "../types/models";

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public email!: string;
  public phone?: string;
  public subject?: string;
  public msg!: string;
  public username?: string;
  public createdAt!: Date;

  public toJSON(): object {
    const values: Partial<MessageAttributes> = { ...this.get() };
    return values;
  }
}

export default (sequelize: Sequelize) => {
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      msg: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "messages",
      createdAt: true,
      updatedAt: false,
    }
  );

  return Message;
};
