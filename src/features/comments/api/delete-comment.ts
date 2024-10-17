import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { getProductDetailQueryOptions } from "./get-comments"

export const deleteComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comment/${commentId}`)
}

type UseDeleteCommentOptions = {
  productId?: string
}

export const useDeleteComment = ({
  productId,
  ...args
}: UseDeleteCommentOptions) => {
  const queryClient = useQueryClient()
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProductDetailQueryOptions({ productId, ...args }).queryKey,
      })
    },
    mutationFn: deleteComment,
  })
}
