import { Optional } from "sequelize";
import { GOVERNORATE, SEX } from "./vars";

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: SEX;
  password: string;
  governorate: GOVERNORATE,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<Omit<UserAttributes, "id" | "createdAt" | "updatedAt">, "gender"> { }

export interface PermissionAttributes {
  id: number;
  userId: number;
  permissions: number;
}

export interface PermissionCreationAttributes extends Optional<Omit<PermissionAttributes, "id">, "permissions"> { }

export interface UnverifiedUserAttributes {
  id: number;
  userId: number;
  code: string;
  expire: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UnverifiedUserCreationAttributes extends Omit<UnverifiedUserAttributes, "id" | "createdAt" | "updatedAt"> { }

export interface ResetPasswordRequestAttributes {
  id: number;
  userId: number;
  code: string;
  expire: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResetPasswordCreationRequestAttributes extends Omit<ResetPasswordRequestAttributes, "id" | "createdAt" | "updatedAt"> { }

export interface CategoryAttributes {
  id: number,
  title: string,
  desc: string
}

export interface CategoryCreationAttributes extends Omit<CategoryAttributes, "id"> { }

export interface SubCategoryAttributes {
  id: number,
  title: string,
  desc: string,
  categoryId: number
}

export interface SubCategoryCreationAttributes extends Omit<SubCategoryAttributes, "id"> { }

export interface ProductAttributes {
  id: number,
  title: string,
  desc: string,
  price: number,
  brandId: number,
  imgUrl?: string | null,
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, "id"> { }

export interface BrandAttributes {
  id: number,
  name: string,
  imgUrl?: string | null
}

export interface BrandCreationAttributes extends Omit<BrandAttributes, "id"> { }
