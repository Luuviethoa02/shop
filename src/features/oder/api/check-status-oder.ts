
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

// export type CreatePCommentInput = z.infer<typeof commentSchema>
export type PaymentResponse = {
    amount: number;
    message: string;
    orderId: string;
    partnerCode: string;
    payUrl: string;
    requestId: string;
    responseTime: number;
    resultCode: number;
};
export const checkStatusOder = ({
  data,
}: {
  data:{
    orderId:string
  } 
}): Promise<PaymentResponse> => {
  return api.post(`/check-status-transaction`, data)
}

export const useCheckStatusOderWithMomo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-status-transaction"],
      })
    },
    mutationFn: checkStatusOder,
  })
}
