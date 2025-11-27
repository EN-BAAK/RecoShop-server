import { Category } from "../models/category"
import { Product } from "../models/product"
import { findBrandById } from "./brand"
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

  const brand = await findBrandById(product.brandId);

  const brandName = brand.name;

  const result = {
    ...json,
    brand: brandName,
    brandId: undefined,
    category: category?.title || undefined,
    subCategories: cleanSubCats,
  };

  return result;
};
