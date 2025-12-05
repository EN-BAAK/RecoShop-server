import { Brand } from "../models/brand"
import ErrorHandler from "./error"

export const findBrandById = async (id: number) => {
  const brand = await Brand.findByPk(id, { attributes: { include: ["imgUrl"] } })

  if (!brand)
    throw new ErrorHandler("brand not found", 404)

  return brand
}

export const findBrandByName = async (name: string) => {
  const brand = await Brand.findOne({ where: { name }, attributes: { include: ["imgUrl"] } })

  if (!brand)
    throw new ErrorHandler("brand not found", 404)

  return brand
}