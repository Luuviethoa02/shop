import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { oderDetailSellerResponse } from "@/types/api"

type UseOrrderDetailOptions = {
  sellerId: string | undefined
  page?: number
  limit?: number
}

export const getOderDetailBySellerId = ({
  sellerId,
  ...args
}: UseOrrderDetailOptions): Promise<oderDetailSellerResponse> => {
  return api.get(`/oder/getAlldetail/${sellerId}`, {
    params: {
      ...args
    }
  })
}

export const getNotificationQueryOptions = (
  {
    sellerId,
    ...args
  }: UseOrrderDetailOptions
) => {
  return {
    queryKey: ["get-oder-detail-by-sellerId", sellerId, args],
    queryFn: () => getOderDetailBySellerId({ sellerId: sellerId, ...args }),
    enabled: !!sellerId,
  }
}

export const useGetOderDetailBySellerId = ({
  sellerId,
  ...args
}: UseOrrderDetailOptions) => {
  return useQuery({
    ...getNotificationQueryOptions({ sellerId, ...args }),
  })
}
