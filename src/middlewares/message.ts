import { Message } from "../models/message";
import ErrorHandler from "./error";

export const findMessageById = async (id: number) => {
  const message = await Message.findByPk(id);

  if (!message)
    throw new ErrorHandler("Message not found", 404)

  return message
}