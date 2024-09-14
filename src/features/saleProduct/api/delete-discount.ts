import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { getDiscountQueryOptions } from "./get-discount-sellerId"

export const deleteDiscount = ({ discountId }: { discountId: string }) => {
  return api.delete(`/discountCode/${discountId}`)
}

export const useDeleteDiscount = (
  {
    page,
    limit,
    sellerId,
  }: { page?: number; limit?: number; sellerId: string } = { sellerId: "" }
) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDiscountQueryOptions({ page, limit, sellerId }).queryKey,
      })
    },
    mutationFn: deleteDiscount,
  })
}
