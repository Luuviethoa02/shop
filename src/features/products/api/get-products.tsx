import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { producstResponse } from "@/types/api"

type UseProductOptions = {
  page: number
  limit: number
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>
}

export const getAllProducts = (
  page: number | undefined,
  limit: number | undefined
): Promise<producstResponse> => {
  return api.get(`/product`, {
    params: {
      page,
      limit,
    },
  })
}

export const getProductsQueryOptions = (
  { page, limit }: { page: number | undefined; limit: number | undefined } = {
    page: undefined,
    limit: undefined,
  }
) => {
  return {
    queryKey: ["products", page, limit],
    queryFn: () => getAllProducts(page, limit),
  }
}

export const useProducts = ({
  page,
  limit,
  queryConfig,
}: UseProductOptions) => {
  return useQuery({
    ...getProductsQueryOptions({ page, limit }),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
