import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { getNotificationQueryOptions } from "./get-orderDetailBySellerId"

// export type CreatePCommentInput = z.infer<typeof commentSchema>
export type PaymentResponse = {
  amount: number
  message: string
  orderId: string
  partnerCode: string
  payUrl: string
  requestId: string
  responseTime: number
  resultCode: number
}
export const updateStatusOrderDetail = ({
  data,
  orderDetailId,
}: {
  data: {
    status: "success" | "shipping" | "canceled"
    messager?: string
    created_by?: string
    shopper?: string
  }
  orderDetailId: string
}): Promise<PaymentResponse> => {
  return api.patch(`/oder/update/statusOder/${orderDetailId}`, data)
}

export const useUpdateStatusOrderDetail = ({
  sellerId = undefined,
}: {
  sellerId: string | undefined
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getNotificationQueryOptions({ sellerId }).queryKey,
      })
    },
    mutationFn: updateStatusOrderDetail,
  })
}
