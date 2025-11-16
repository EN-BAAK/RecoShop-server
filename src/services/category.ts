import { findCategoryById } from "../middlewares/category";
import { Category } from "../models/category";
import { SubCategory } from "../models/subcategory";
import { CategoryCreationAttributes } from "../types/models";

export const getCategories = async () => {
  return Category.findAll({
    order: [["id", "DESC"]],
  });
};

export const getAllCategoriesWithSubCategory = async () => {
  return Category.findAll({
    include: [
      {
        model: SubCategory,
        as: "subCategories",
      },
    ],
    order: [["id", "DESC"]],
  });
};

export const getCategory = async (id: number) => {
  const category = findCategoryById(id)
  return category
}

export const createCategory = async (data: CategoryCreationAttributes) => {
  const category = await Category.create(data)
  return category;
};

export const updateCategory = async (id: number, data: Partial<CategoryCreationAttributes>) => {
  const category = await findCategoryById(id)

  if (data.title !== undefined) category.title = data.title;
  if (data.desc !== undefined) category.desc = data.desc;

  await category.save();
  return category;
};

export const deleteCategoryById = async (id: number) => {
  const category = await findCategoryById(id)

  await category.destroy();
  return { message: "Category deleted successfully" };
};