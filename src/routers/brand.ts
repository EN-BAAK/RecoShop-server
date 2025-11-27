import { Router } from "express";
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand, getBrandImage, } from "../controllers/brand";
import { createBrand as createBrandValidation, updateBrand as updateBrandValidation, brandId as brandIdValidation } from "../validations/brand";
import { validation } from "../middlewares/error";
import { uploadBrandImage } from "../utils/multer";

const router = Router();

router.get("/", getAllBrands);
router.get("/:id/image", brandIdValidation, validation, getBrandImage);
router.get("/:id", brandIdValidation, validation, getBrandById);

router.post("/", uploadBrandImage.single("image"), createBrandValidation, validation, createBrand);

router.put("/:id", uploadBrandImage.single("image"), updateBrandValidation, validation, updateBrand);

router.delete("/:id", brandIdValidation, validation, deleteBrand);

export default router;
