import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { producstResponse } from "@/types/api"

type UseProductOptions = {
  page: number
  limit: number
  sellerId: string
  status: string
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>
}

export const getSellerIdProducts = (
  sellerId: string,
  page: number | undefined,
  limit: number | undefined,
  status: string | undefined
): Promise<producstResponse> => {
  return api.get(`/product/seller/${sellerId}`, {
    params: {
      page,
      limit,
      status,
    },
  })
}

export const getProductsQueryOptions = (
  {
    page,
    limit,
    sellerId,
    status,
  }: {
    sellerId: string
    page: number | undefined
    limit: number | undefined
    status: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    sellerId: "",
    status: undefined,
  }
) => {
  return {
    queryKey: ["products", sellerId, page, limit, status],
    queryFn: () => getSellerIdProducts(sellerId, page, limit, status),
  }
}

export const useProductSellerId = ({
  page,
  limit,
  sellerId,
  queryConfig,
  status,
}: UseProductOptions) => {
  return useQuery({
    ...getProductsQueryOptions({ page, limit, sellerId, status }),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
