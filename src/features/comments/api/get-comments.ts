import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { commentsResponse } from "@/types/api"

type UseCommentsOptions = {
  productId?: string
}

export const getCommentsByProduct = ({
  productId,
  ...args
}: {
  productId?: string
}): Promise<commentsResponse> => {
  return api.get(`/comment/product/${productId}`, {
    params: {
      ...args,
    },
  })
}

export const getProductDetailQueryOptions = ({
  productId,
  ...args
}: {
  productId?: string
}) => {
  return {
    queryKey: ["comments", productId, { ...args }],
    queryFn: () => getCommentsByProduct({ productId, ...args }),
    enabled: !!productId,
  }
}

export const useCommentsByProductId = ({
  productId,
  ...args
}: UseCommentsOptions) => {
  return useQuery({
    ...getProductDetailQueryOptions({ productId, ...args }),
  })
}
