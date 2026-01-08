import express from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { addComment as addCommentValidation, getProductComments as getProductCommentsValidation } from "../validations/comment";
import { addComment, getProductComments } from "../controllers/comment";
import { validation } from "../middlewares/error";

const router = express.Router();

router.get("/:productId", getProductCommentsValidation, validation, getProductComments);

router.post("/", verifyAuthentication, addCommentValidation, validation, addComment);

export default router;
