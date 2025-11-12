import { Category } from "../models/category"
import ErrorHandler from "./error"

export const findCategoryById = async (id: number) => {
  const category = await Category.findByPk(id)

  if (!category)
    throw new ErrorHandler("Category not found", 404)

  return category
}