import { z } from "zod"

export const commentSchema = z.object({
  commentText: z.string().min(1, "Bình luận không được để trống"),
  rating: z.string(),
  productId: z.string().optional(),
  userId: z.string().optional(),
  sellerId: z.string().optional(),
  imgs: z.array(z.any()).optional(),
})

export const deleteCommentSchema = z.object({
  commentId: z.string(),
})
