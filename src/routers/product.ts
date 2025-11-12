import express from "express";
import { getAllProducts, getProductById, getProductImage, createProduct, updateProduct, deleteProduct, } from "../controllers/product";
import { createProduct as createProductValidation, updateProduct as updateProductValidation, productIdParam as productIdParamValidation, } from "../validations/product";
import { validation } from "../middlewares/error";
import { uploadProductImage } from "../utils/multer";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", productIdParamValidation, validation, getProductById);
router.get("/:id/image", productIdParamValidation, validation, getProductImage);

router.post("/", uploadProductImage.single("image"), createProductValidation, validation, createProduct);

router.put("/:id", uploadProductImage.single("image"), updateProductValidation, validation, updateProduct);

router.delete("/:id", productIdParamValidation, validation, deleteProduct);

export default router;
