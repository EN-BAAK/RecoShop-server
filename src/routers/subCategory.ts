import { Router } from "express";
import { getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory, getSubCategoriesByCategory, } from "../controllers/subCategory";
import { createSubCategory as createSubCategoryValidation, updateSubCategory as updateSubCategoryValidation, subCategoryId as subCategoryIdValidation, } from "../validations/subCategory";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = Router();

router.get("/", getAllSubCategories);
router.get("/identifies/:category", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getSubCategoriesByCategory);
router.get("/:id", verifyAuthentication, subCategoryIdValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getSubCategoryById);

router.post("/", verifyAuthentication, createSubCategoryValidation, validation, requirePermission(PERMISSIONS.ADD), createSubCategory);

router.put("/:id", verifyAuthentication, updateSubCategoryValidation, validation, requirePermission(PERMISSIONS.EDIT), updateSubCategory);

router.delete("/:id", verifyAuthentication, subCategoryIdValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteSubCategory);

export default router;
