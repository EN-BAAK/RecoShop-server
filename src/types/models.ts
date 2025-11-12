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

export interface RoleAttributes {
  id: number;
  userId: number;
  role: number;
}

export interface RoleCreationAttributes extends Optional<Omit<RoleAttributes, "id">, "role"> { }

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
  brand: string,
  imgUrl?: string | null,
  categoryId: number
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, "id"> { }