import { Review } from "../models/review";
import { findProductById } from "../middlewares/product";

export const addReview = async (data: {
  userId: number;
  productId: number;
}) => {
  await findProductById(data.productId);

  const review = await Review.create(data);
  return review;
};
