import { Wallet } from "../models/wallet"
import ErrorHandler from "./error"

export const findWalletByUserId = async (userId: number, transaction?: any) => {
  const wallet = await Wallet.findOne({ where: { userId }, transaction })
  if (!wallet)
    throw new ErrorHandler("Wallet not found", 404)

  return wallet
}