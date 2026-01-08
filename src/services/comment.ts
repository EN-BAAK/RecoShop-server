import { Comment } from "../models/comment";
import { findProductById } from "../middlewares/product";
import { User } from "../models/user";

export const addComment = async (data: { userId: number; productId: number; comment: string; }) => {
  await findProductById(data.productId);

  const comment = await Comment.create(data);
  return comment;
};

export const getProductComments = async ({ productId, limit, page = 1 }: { productId: number; limit?: number; page?: number }) => {
  await findProductById(productId);

  const offset =
    limit && limit > 0 ? (page - 1) * limit : undefined;

  const { count, rows } = await Comment.findAndCountAll({
    where: { productId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName"],
      },
    ],
    ...(limit ? { limit, offset } : {}),
  });

  const formattedComments = rows.map((comment) => {
    const json = comment.toJSON() as any;

    return {
      id: json.id,
      name: json.user?.firstName + " " + json.user?.lastName,
      date: json.createdAt,
      comment: json.comment,
    };
  });


  return {
    comments: formattedComments,
    totalCount: count,
    totalPages: limit ? Math.ceil(count / limit) : 1,
    currentPage: page,
  };
};