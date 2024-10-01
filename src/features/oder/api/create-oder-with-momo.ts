
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { OdersProduct } from "@/types/client";


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
export const createOder = ({
  data,
}: {
  data:{
    oder:OdersProduct['oder'],
    oderDetails:OdersProduct['oderDetails'][],
  } 
}): Promise<PaymentResponse> => {
  return api.post(`/payment`, data)
}

export const useCreateOderWithMomo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["create-oder-momo"],
      })
    },
    mutationFn: createOder,
  })
}
