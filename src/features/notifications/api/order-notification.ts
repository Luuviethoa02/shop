import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { orderNotifiCationResponse } from "@/types/api"

type UseNotificationOptions = {
  page: number
  limit: number
  sellerId: string | undefined
  queryConfig?: QueryConfig<typeof getOrderNotificationQueryOptions>
}

export const getOrderNotificationBysellerId = ({
  sellerId,
  page,
  limit,
}: {
  sellerId: string | undefined
  page: number | undefined
  limit: number | undefined
}): Promise<orderNotifiCationResponse> => {
  return api.get(`/orderNotification/getAll/${sellerId}`, {
    params: {
      page,
      limit,
    },
  })
}

export const getOrderNotificationQueryOptions = (
  {
    page,
    limit,
    sellerId,
  }: {
    page: number | undefined
    limit: number | undefined
    sellerId: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    sellerId: undefined,
  }
) => {
  return {
    queryKey: ["notifications-order-sellerId", sellerId],
    queryFn: () => getOrderNotificationBysellerId({ sellerId, page, limit }),
    enabled: !!sellerId,
  }
}

export const useOrderNotificationBySellerId = ({
  sellerId,
  page,
  limit,
  queryConfig,
}: UseNotificationOptions) => {
  return useQuery({
    ...getOrderNotificationQueryOptions({ sellerId, page, limit }),
    ...queryConfig,
  })
}
