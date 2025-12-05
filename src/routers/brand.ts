import { Router } from "express";
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand, getBrandImageById, getBrandImageByName, } from "../controllers/brand";
import { createBrand as createBrandValidation, updateBrand as updateBrandValidation, brandId as brandIdValidation, brandName as brandNameValidation } from "../validations/brand";
import { validation } from "../middlewares/error";
import { uploadBrandImage } from "../utils/multer";

const router = Router();

router.get("/", getAllBrands);
router.get("/name/:name/image", brandNameValidation, validation, getBrandImageByName);

router.get("/:id/image", brandIdValidation, validation, getBrandImageById);
router.get("/:id", brandIdValidation, validation, getBrandById);

router.post("/", uploadBrandImage.single("image"), createBrandValidation, validation, createBrand);

router.put("/:id", uploadBrandImage.single("image"), updateBrandValidation, validation, updateBrand);

router.delete("/:id", brandIdValidation, validation, deleteBrand);

export default router;
