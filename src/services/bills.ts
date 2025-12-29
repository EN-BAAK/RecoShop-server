import db from "../models";
import ErrorHandler from "../middlewares/error";
import { Product } from "../models/product";
import { WalletTransaction } from "../models/walletTransaction";
import { Bill } from "../models/bill";
import { BillProduct } from "../models/billProduct";
import { WALLET_TRANSACTION } from "../types/vars";
import { findWalletByUserId } from "../middlewares/wallet";
import { Op } from "sequelize";
import { Wallet } from "../models/wallet";

export const purchaseProducts = async (
  userId: number,
  productsInput: { productId: number; quantity?: number }[]
) => {
  return db.sequelize!.transaction(async (transaction) => {
    const wallet = await findWalletByUserId(userId)

    const productIds = productsInput.map(p => p.productId)

    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
    })

    if (products.length !== productIds.length)
      throw new ErrorHandler("Some products not found", 404)

    const quantityMap = new Map<number, number>()
    productsInput.forEach(p => {
      quantityMap.set(p.productId, p.quantity ?? 1)
    })

    const totalPrice = products.reduce((sum, product) => {
      const quantity = quantityMap.get(product.id) ?? 1
      return sum + product.price * quantity
    }, 0)

    if (wallet.balance < totalPrice)
      throw new ErrorHandler("Insufficient balance", 400)

    wallet.balance -= totalPrice
    await wallet.save({ transaction })

    const walletTransaction = await WalletTransaction.create(
      {
        walletId: wallet.id,
        amount: totalPrice,
        type: WALLET_TRANSACTION.PURCHASE,
        reason: "Product purchase",
      },
      { transaction }
    )

    const bill = await Bill.create(
      {
        walletTransactionId: walletTransaction.id,
      },
      { transaction }
    )

    const billProducts = products.map(product => ({
      billId: bill.id,
      productId: product.id,
      quantity: quantityMap.get(product.id) ?? 1,
    }))

    await BillProduct.bulkCreate(billProducts, { transaction })

    return bill
  })
}

export const getUserBills = async (
  userId: number,
  startDate?: string,
  endDate?: string
) => {
  const transactionWhere: any = {};

  if (startDate && endDate) {
    transactionWhere.createdAt = {
      [Op.between]: [startDate, endDate],
    };
  } else if (startDate) {
    transactionWhere.createdAt = {
      [Op.gte]: startDate,
    };
  } else if (endDate) {
    transactionWhere.createdAt = {
      [Op.lte]: endDate,
    };
  }

  const wallet = await Wallet.findOne({
    where: { userId },
    attributes: [],
    include: [
      {
        model: WalletTransaction,
        as: "transactions",
        where: transactionWhere,
        required: true,
        attributes: ["id", "amount", "createdAt"],
        include: [
          {
            model: Bill,
            as: "bill",
            attributes: { exclude: ["walletTransactionId", "createdAt"] },
            include: [
              {
                model: BillProduct,
                as: "items",
                attributes: ["id", "quantity"],
                include: [
                  {
                    model: Product,
                    as: "product",
                    attributes: ["id", "title", "price"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [[{ model: WalletTransaction, as: "transactions" }, "createdAt", "DESC"]],
  });

  const walletJson = wallet?.toJSON() as any;

  const transactions =
    walletJson?.transactions.map((tx: any) => ({
      id: tx.id,
      amount: tx.amount,
      createdAt: tx.createdAt,
      products: tx.bill
        ? tx.bill.items.map((item: any) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        }))
        : [],
    })) ?? [];


  return transactions
};
