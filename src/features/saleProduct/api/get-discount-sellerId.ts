import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { discountResponse } from "@/types/api"

type UseDiscountOptions = {
  page: number
  limit: number
  sellerId: string
  queryConfig?: QueryConfig<typeof getDiscountQueryOptions>
}

export const getSellerIdProducts = (
  sellerId: string,
  page: number | undefined,
  limit: number | undefined
): Promise<discountResponse> => {
  return api.get(`/discountCode/${sellerId}`, {
    params: {
      page,
      limit,
    },
  })
}

export const getDiscountQueryOptions = (
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
    queryKey: ["discount", sellerId, page, limit],
    queryFn: () => getSellerIdProducts(sellerId, page, limit),
  }
}

export const useDiscountSellerId = ({
  page,
  limit,
  sellerId,
  queryConfig,
}: UseDiscountOptions) => {
  return useQuery({
    ...getDiscountQueryOptions({ page, limit, sellerId }),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
