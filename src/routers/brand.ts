import { Router } from "express";
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand, getBrandImageById, getBrandImageByName, getAllBrandsIdentities, } from "../controllers/brand";
import { createBrand as createBrandValidation, updateBrand as updateBrandValidation, brandId as brandIdValidation, brandName as brandNameValidation } from "../validations/brand";
import { validation } from "../middlewares/error";
import { uploadBrandImage } from "../utils/multer";
import { PERMISSIONS } from "../constants/globals";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";

const router = Router();

router.get("/", getAllBrands);
router.get("/identities", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllBrandsIdentities);
router.get("/name/:name/image", brandNameValidation, validation, getBrandImageByName);
router.get("/:id/image", verifyAuthentication, brandIdValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getBrandImageById);
router.get("/:id", verifyAuthentication, brandIdValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getBrandById);

router.post("/", uploadBrandImage.single("image"), verifyAuthentication, createBrandValidation, validation, requirePermission(PERMISSIONS.ADD), createBrand);

router.put("/:id", uploadBrandImage.single("image"), verifyAuthentication, updateBrandValidation, validation, requirePermission(PERMISSIONS.EDIT), updateBrand);

router.delete("/:id", verifyAuthentication, brandIdValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteBrand);

export default router;
