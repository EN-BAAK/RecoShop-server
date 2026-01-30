import { findMessageById } from "../middlewares/message";
import { Message } from "../models/message";
import { MessageCreationAttributes } from "../types/models";

export const getAllMessages = async () => {
  const messages = await Message.findAll({ order: [["createdAt", "DESC"]] });
  return messages.map((msg: any) => msg.toJSON());
};

export const getMessageById = async (id: number) => {
  const message = await findMessageById(id)
  return message.toJSON();
};

export const postMessage = async (data: MessageCreationAttributes) => {
  const message = await Message.create(data);
  return message.toJSON();
};

export const deleteMessage = async (id: number) => {
  const message = await findMessageById(id)
  await message.destroy();
};
