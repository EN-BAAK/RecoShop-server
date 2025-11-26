import { findCategoryById, findCategoryByTitle } from "../middlewares/category";
import { findSubCategoryById } from "../middlewares/subCategory";
import { Category } from "../models/category";
import { SubCategory } from "../models/subcategory";
import { SubCategoryCreationAttributes } from "../types/models";

export const getAllSubCategories = async () => {
  const subCategories = await SubCategory.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ['title']
      }
    ]
  });

  const data = subCategories.map(sub => {
    const json = sub.toJSON() as any;

    return {
      ...json,
      category: json.category.title
    }
  })

  return data
};

export const getSubCategoriesByCategoryTitle = async (categoryName: string) => {
  const category = await findCategoryByTitle(categoryName)

  const subCategories = await SubCategory.findAll({
    where: { categoryId: category.id },
    order: [["id", "DESC"]],
    attributes: ["id", "title"]
  });

  const data = subCategories.map((sub: any) => {
    const json = sub.toJSON();

    return {
      ...json,
    };
  });

  return data;
};

export const getSubCategoryById = async (id: number) => {
  const subCategory = await findSubCategoryById(id);
  return subCategory;
};

export const createSubCategory = async (data: SubCategoryCreationAttributes) => {
  await findCategoryById(data.categoryId)

  const category = await SubCategory.create(data)
  const mainCategory = await findCategoryById(category.categoryId)

  const json = category.toJSON()
  return {
    ...json,
    categoryId: undefined,
    category: mainCategory.title
  };
};

export const updateSubCategory = async (id: number, data: Partial<SubCategoryCreationAttributes>) => {
  const category = await findSubCategoryById(id)

  if (data.title !== undefined) category.title = data.title;
  if (data.desc !== undefined) category.desc = data.desc;
  if (data.categoryId !== undefined) {
    await findCategoryById(data.categoryId);
    category.categoryId = data.categoryId;
  }

  await category.save();
  const mainCategory = await findCategoryById(category.categoryId)

  const json = category.toJSON()

  return {
    ...json,
    categoryId: undefined,
    category: mainCategory.title
  };
};

export const deleteSubCategory = async (id: number) => {
  const category = await findSubCategoryById(id)

  await category.destroy();
  return { message: "Category deleted successfully" };
};