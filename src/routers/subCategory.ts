import { Router } from "express";
import { getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory, getSubCategoriesByCategory, } from "../controllers/subCategory";
import { createSubCategory as createSubCategoryValidation, updateSubCategory as updateSubCategoryValidation, subCategoryId as subCategoryIdValidation, } from "../validations/subCategory";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/", getAllSubCategories);
router.get("/identifies/:category", getSubCategoriesByCategory);
router.get("/:id", subCategoryIdValidation, validation, getSubCategoryById);

router.post("/", createSubCategoryValidation, validation, createSubCategory);

router.put("/:id", updateSubCategoryValidation, validation, updateSubCategory);

router.delete("/:id", subCategoryIdValidation, validation, deleteSubCategory);

export default router;
