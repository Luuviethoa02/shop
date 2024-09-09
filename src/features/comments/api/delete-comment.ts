import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { getProductDetailQueryOptions } from "./get-comments"

export const deleteComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comment/${commentId}`)
}

type UseDeleteCommentOptions = {
  productId: string | undefined
  page: number
  limit: number
  mutationConfig?: MutationConfig<typeof deleteComment>
}

export const useDeleteComment = ({
  mutationConfig,
  page,
  limit,
  productId,
}: UseDeleteCommentOptions) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProductDetailQueryOptions({ productId, page, limit })
          .queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: deleteComment,
  })
}
