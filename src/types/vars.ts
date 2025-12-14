export enum SEX {
  MALE = "Male",
  FEMALE = "Female"
}

export enum GOVERNORATE {
  DAMASCUS = "Damascus",
  RIF_DIMASHQ = "Rural Damascus",
  ALEPPO = "Aleppo",
  HOMS = "Homs",
  HAMA = "Hama",
  LATAKIA = "Latakia",
  TARTUS = "Tartus",
  IDLIB = "Idlib",
  DEIR_EZZOR = "Deir ez-Zor",
  RAQQA = "Raqqa",
  HASAKAH = "Al-Hasakah",
  DARAA = "Daraa",
  AS_SWEIDA = "As-Suwayda",
  QUNEITRA = "Quneitra",
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};

export enum WALLET_TRANSACTION {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  PURCHASE = "purchase",
  REFUND = "refund",
}