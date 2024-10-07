import { api } from "@/lib/api-client"
import { orderNotifiCationResponse } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrderNotificationQueryOptions } from "./order-notification"

export const updateManyStatusOrder = ({
  sellerId,
}: {
  sellerId: string
}): Promise<orderNotifiCationResponse> => {
  return api.patch(`/orderNotification/updateAllStatus/${sellerId}`)
}

export const useUpdateManyStatusOrder = (
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
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getOrderNotificationQueryOptions({ page, limit, sellerId })
          .queryKey,
      })
    },
    mutationFn: updateManyStatusOrder,
  })
}
