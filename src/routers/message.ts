import express from "express";
import { deleteMessage, getAllMessages, getMessageById, postMessage } from "../controllers/message";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";
import { postMessage as postMessageValidation, messageIdParam as messageIdParamValidation } from "../validations/message";

const router = express.Router();

router.get("/", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllMessages);
router.get("/:id", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), messageIdParamValidation, validation, getMessageById);

router.post("/", postMessageValidation, validation, postMessage);

router.delete("/:id", verifyAuthentication, requirePermission(PERMISSIONS.DELETE), messageIdParamValidation, validation, deleteMessage);

export default router;
