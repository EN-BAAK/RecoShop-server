import { Product } from "../models/product"
import ErrorHandler from "./error"

export const findProductById = async (id: number) => {
  const product = await Product.findByPk(id)

  if (!product)
    throw new ErrorHandler("Product not found", 404)

  return product
}