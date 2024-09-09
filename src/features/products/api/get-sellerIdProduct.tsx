import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { producstResponse } from "@/types/api"

type UseProductOptions = {
  page: number
  limit: number
  sellerId: string
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>
}

export const getSellerIdProducts = (
  sellerId: string,
  page: number | undefined,
  limit: number | undefined
): Promise<producstResponse> => {
  return api.get(`/product/seller/${sellerId}`, {
    params: {
      page,
      limit,
    },
  })
}

export const getProductsQueryOptions = (
  {
    page,
    limit,
    sellerId,
  }: {
    sellerId: string
    page: number | undefined
    limit: number | undefined
  } = {
    page: undefined,
    limit: undefined,
    sellerId: "",
  }
) => {
  return {
    queryKey: ["products", sellerId, page, limit],
    queryFn: () => getSellerIdProducts(sellerId, page, limit),
  }
}

export const useProductSellerId = ({
  page,
  limit,
  sellerId,
  queryConfig,
}: UseProductOptions) => {
  return useQuery({
    ...getProductsQueryOptions({ page, limit, sellerId }),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
