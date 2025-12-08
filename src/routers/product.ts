import express from "express";
import { getAllProducts, getProductSettingsById, getProductImage, createProduct, updateProduct, deleteProduct, getProductsPaginatedWithFiltering } from "../controllers/product";
import { createProduct as createProductValidation, updateProduct as updateProductValidation, productIdParam as productIdParamValidation, getProductsByCategory as getProductsByCategoryValidation } from "../validations/product";
import { validation } from "../middlewares/error";
import { uploadProductImage } from "../utils/multer";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = express.Router();

router.get("/", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllProducts);
router.get("/shop", getProductsByCategoryValidation, validation, getProductsPaginatedWithFiltering);
router.get("/settings/:id", verifyAuthentication, productIdParamValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getProductSettingsById);
router.get("/:id/image", productIdParamValidation, validation, getProductImage);

router.post("/", verifyAuthentication, uploadProductImage.single("image"), createProductValidation, validation, requirePermission(PERMISSIONS.ADD), createProduct);

router.put("/:id", verifyAuthentication, uploadProductImage.single("image"), updateProductValidation, validation, requirePermission(PERMISSIONS.EDIT), updateProduct);

router.delete("/:id", verifyAuthentication, productIdParamValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteProduct);

export default router;
