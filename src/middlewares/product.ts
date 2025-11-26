import { Category } from "../models/category"
import { Product } from "../models/product"
import ErrorHandler from "./error"

export const findProductById = async (id: number) => {
  const product = await Product.findByPk(id)

  if (!product)
    throw new ErrorHandler("Product not found", 404)

  return product
}

export const formatProductResponse = async (product: any) => {
  const json = product.toJSON();

  const subCats = json.subCategories || [];

  const category =
    subCats.length > 0
      ? await Category.findByPk(subCats[0].categoryId, { attributes: ["title"] })
      : undefined;

  const cleanSubCats = subCats.map((sc: any) => ({
    id: sc.id,
    title: sc.title,
  }));

  return {
    ...json,
    category: category?.title || undefined,
    subCategories: cleanSubCats,
  };
};
