import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { Seller } from "@/types/client"
import { ResponseSuccess } from "@/types/api"

export type UseGetShopBySlugOptions = {
  sellerId?: string
  page?: number
  limit?: number
  status?: string
}

export type analysticsType = Seller & {
  totalProducts: number
  totalOrders: {
    totalOrdersPending: number
    totalOrdersShipping: number
    totalOrdersSuccess: number
    totalOrdersCanceled: number
  }
  totalComments: number
  totalFollowers: number
  revenueProducts: number
}

export const getAnalysticsBySellerId = ({
  sellerId,
  ...agrs
}: UseGetShopBySlugOptions): Promise<ResponseSuccess<analysticsType>> => {
  return api.get(`/seller/getAnalystics/${sellerId}`, {
    params: {
      ...agrs,
    },
  })
}

export const getShopQueryOptions = ({
  sellerId,
  ...agrs
}: UseGetShopBySlugOptions) => {
  return {
    queryKey: ["get-analystics-by-sellerId", sellerId, { ...agrs }],
    queryFn: () => getAnalysticsBySellerId({ sellerId, ...agrs }),
    enabled: !!sellerId,
  }
}

export const useGetAnalysticsBySellerId = ({
  sellerId,
  ...args
}: UseGetShopBySlugOptions) => {
  return useQuery({
    ...getShopQueryOptions({ sellerId, ...args }),
  })
}
