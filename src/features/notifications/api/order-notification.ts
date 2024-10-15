import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { orderNotifiCationResponse } from "@/types/api"

type UseNotificationOptions = {
  sellerId?: string
  page?: number
  limit?: number
}

export const getOrderNotificationBysellerId = ({
  sellerId,
  ...args
}: UseNotificationOptions): Promise<orderNotifiCationResponse> => {
  return api.get(`/orderNotification/getAll/${sellerId}`, {
    params: {
      ...args,
    },
  })
}

export const getOrderNotificationQueryOptions = ({
  sellerId,
  ...args
}: UseNotificationOptions) => {
  return {
    queryKey: ["notifications-order-sellerId", sellerId, { ...args }],
    queryFn: () => getOrderNotificationBysellerId({ sellerId, ...args }),
    enabled: !!sellerId,
  }
}

export const useOrderNotificationBySellerId = ({
  sellerId,
  ...args
}: UseNotificationOptions) => {
  return useQuery({
    ...getOrderNotificationQueryOptions({ sellerId, ...args }),
  })
}
