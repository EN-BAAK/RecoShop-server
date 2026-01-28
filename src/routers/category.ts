import { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getAllCategoriesWithSubCategory, getAllCategoriesIdentities } from "../controllers/category";
import { createCategory as createCategoryValidation, updateCategory as updateCategoryValidation, categoryId as categoryIdValidation, } from "../validations/category";
import { validation } from "../middlewares/error";
import { requirePermission, verifyAuthentication } from "../middlewares/auth";
import { PERMISSIONS } from "../constants/globals";

const router = Router();

router.get("/", getAllCategories);
router.get("/identities", verifyAuthentication, requirePermission(PERMISSIONS.VIEW_PRIVATE), getAllCategoriesIdentities);
router.get("/with-subcategories", getAllCategoriesWithSubCategory);
router.get("/:id", verifyAuthentication, categoryIdValidation, validation, requirePermission(PERMISSIONS.VIEW_PRIVATE), getCategoryById);

router.post("/", verifyAuthentication, createCategoryValidation, validation, requirePermission(PERMISSIONS.ADD), createCategory);

router.put("/:id", verifyAuthentication, updateCategoryValidation, validation, requirePermission(PERMISSIONS.EDIT), updateCategory);

router.delete("/:id", verifyAuthentication, categoryIdValidation, validation, requirePermission(PERMISSIONS.DELETE), deleteCategory);

export default router;
