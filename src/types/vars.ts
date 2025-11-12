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

export enum PERMISSION {
  VIEW = 1 << 0,
  ADD = 1 << 1,
  EDIT = 1 << 2,
  DELETE = 1 << 3,
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};