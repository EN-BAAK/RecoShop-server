import { SubCategory } from "../models/subcategory"
import ErrorHandler from "./error"

export const findSubCategoryById = async (id: number) => {
  const category = await SubCategory.findByPk(id)

  if (!category)
    throw new ErrorHandler("Sub Category not found", 404)

  return category
}