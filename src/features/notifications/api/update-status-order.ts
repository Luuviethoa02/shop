import { api } from "@/lib/api-client"
import { orderNotifiCationResponse } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrderNotificationQueryOptions } from "./order-notification"

const updateStatusOrder = ({
  notifiId,
}: {
  notifiId: string
}): Promise<orderNotifiCationResponse> => {
  return api.patch(`/orderNotification/updateStatus/${notifiId}`)
}

export const useUpdateStatusOrder = ({
  sellerId,
  page,
  limit,
}: {
  sellerId: string
  page: number | undefined
  limit: number | undefined
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStatusOrder,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: getOrderNotificationQueryOptions({
          page,
          limit,
          sellerId,
        }).queryKey,
      })
    },
  })
}
