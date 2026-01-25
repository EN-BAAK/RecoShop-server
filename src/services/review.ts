import { Review } from "../models/review";
import { findProductById } from "../middlewares/product";

export const addReview = async (data: { userId: number | null; productId: number; }) => {
  const { userId, productId } = data
  if (!userId)
    return;

  await findProductById(productId);

  const review = await Review.create({ userId, productId });
  return review;
};
