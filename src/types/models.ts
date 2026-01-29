import { Optional } from "sequelize";
import { GOVERNORATE, SEX, WALLET_TRANSACTION } from "./vars";

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

export interface WalletAttributes {
  id: number,
  userId: number,
  balance: number,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletCreationAttributes extends Omit<WalletAttributes, "id" | "createdAt" | "updatedAt"> { }

export interface WalletTransactionAttributes {
  id: number,
  walletId: number,
  amount: number,
  type: WALLET_TRANSACTION
  reason?: string
  createdAt?: Date;
}

export interface WalletTransactionCreationAttributes extends Omit<WalletTransactionAttributes, "id" | "createdAt"> { }

export interface BillAttributes {
  id: number,
  walletTransactionId: number,
}

export interface BillCreationAttributes extends Omit<BillAttributes, "id"> { }

export interface BillProductAttributes {
  id: number,
  billId: number,
  productId?: number,
  quantity: number
}

export interface BillProductCreationAttributes {
  billId: number,
  productId?: number,
  quantity: number
}

export interface ReviewAttributes {
  id: number,
  userId: number,
  productId: number,
  createdAt?: Date
}

export interface ReviewCreationAttributes extends Omit<ReviewAttributes, "id" | "createdAt"> { }

export interface CommentAttributes {
  id: number;
  userId: number;
  productId: number;
  comment: string;
  createdAt?: Date;
}

export interface CommentCreationAttributes
  extends Omit<CommentAttributes, "id" | "createdAt"> { }

export interface RateAttributes {
  id: number;
  userId: number;
  productId: number;
  rate: number;
}

export interface RateCreationAttributes
  extends Omit<RateAttributes, "id"> { }

export interface GroupBranchAttributes {
  id: number;
  name: string;
}

export interface GroupBranchCreationAttributes extends Omit<GroupBranchAttributes, "id"> { }

export interface BranchAttributes {
  id: number;
  name: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  telephone?: string;
  groupId?: number;
}

export interface BranchCreationAttributes extends Omit<BranchAttributes, "id"> { }