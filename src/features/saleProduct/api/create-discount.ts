import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { discountResponse } from "@/types/api"
import { getDiscountQueryOptions } from "./get-discount-sellerId"

export const createDiscount = ({
  data,
}: {
  data: {
    start_date: string
    end_date: string
    discount_percentage: string
    sellerId: string
    description?: string | undefined
  }
}): Promise<discountResponse> => {
  return api.post(`/discountCode/add`, data)
}

export const useCreateDiscount = (
  {
    page,
    limit,
    sellerId,
  }: { page?: number; limit?: number; sellerId: string } = { sellerId: "" }
) => {
  const queryClient = useQueryClient()
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscountQueryOptions({ page, limit, sellerId }).queryKey,
      })
    },
    mutationFn: createDiscount,
  })
}
