import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllMessages as getAllMessagesService, getMessageById as getMessageByIdService, postMessage as postMessageService, deleteMessage as deleteMessageService } from "../services/message";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllMessages = catchAsyncErrors(async (_: Request, res: Response) => {
  const messages = await getAllMessagesService();
  sendSuccessResponse(res, 200, "Messages fetched successfully", messages);
});

export const getMessageById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const message = await getMessageByIdService(id);
  sendSuccessResponse(res, 200, "Message fetched successfully", message);
});

export const postMessage = catchAsyncErrors(async (req: Request, res: Response) => {
  console.log("DD")
  const data = req.body;
  const message = await postMessageService(data);
  sendSuccessResponse(res, 201, "Message created successfully", message);
});

export const deleteMessage = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteMessageService(id);
  sendSuccessResponse(res, 200, "Message deleted successfully");
});
