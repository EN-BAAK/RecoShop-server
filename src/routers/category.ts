import { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getAllCategoriesWithSubCategory } from "../controllers/category";
import { createCategory as createCategoryValidation, updateCategory as updateCategoryValidation, categoryId as categoryIdValidation, } from "../validations/category";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/", getAllCategories);
router.get("/with-subcategories", getAllCategoriesWithSubCategory);
router.get("/:id", categoryIdValidation, validation, getCategoryById);

router.post("/", createCategoryValidation, validation, createCategory);

router.put("/:id", updateCategoryValidation, validation, updateCategory);

router.delete("/:id", categoryIdValidation, validation, deleteCategory);

export default router;
