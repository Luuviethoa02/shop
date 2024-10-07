import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { oderDetailSellerResponse } from "@/types/api"

type UseOrrderDetailOptions = {
  sellerId: string | undefined
}

export const getOderDetailBySellerId = ({
  sellerId,
}: {
  sellerId: string | undefined
}): Promise<oderDetailSellerResponse> => {
  return api.get(`/oder/getAlldetail/${sellerId}`)
}

export const getNotificationQueryOptions = (
  {
    sellerId,
  }: {
    sellerId: string | undefined
  } = {
    sellerId: undefined,
  }
) => {
  return {
    queryKey: ["get-oder-detail-by-sellerId", sellerId],
    queryFn: () => getOderDetailBySellerId({ sellerId: sellerId }),
    enabled: !!sellerId,
  }
}

export const useGetOderDetailBySellerId = ({
  sellerId,
}: UseOrrderDetailOptions) => {
  return useQuery({
    ...getNotificationQueryOptions({ sellerId }),
  })
}
