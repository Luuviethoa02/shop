import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { commentsResponse } from "@/types/api"

type UseCommentsOptions = {
  page: number
  limit: number
  productId: string | undefined
  queryConfig?: QueryConfig<typeof getProductDetailQueryOptions>
}

export const getCommentsByProduct = ({
  productId,
  page,
  limit,
}: {
  productId: string | undefined
  page: number | undefined
  limit: number | undefined
}): Promise<commentsResponse> => {
  return api.get(`/comment/product/${productId}`, {
    params: {
      page,
      limit,
    },
  })
}

export const getProductDetailQueryOptions = (
  {
    page,
    limit,
    productId,
  }: {
    page: number | undefined
    limit: number | undefined
    productId: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    productId: undefined,
  }
) => {
  return {
    queryKey: ["comments", productId],
    queryFn: () => getCommentsByProduct({ productId, page, limit }),
    enabled: !!productId,
  }
}

export const useCommentsByProductId = ({
  productId,
  page,
  limit,
  queryConfig,
}: UseCommentsOptions) => {
  return useQuery({
    ...getProductDetailQueryOptions({ productId, page, limit }),
    ...queryConfig,
  })
}
