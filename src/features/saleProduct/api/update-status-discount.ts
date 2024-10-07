import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { getDiscountQueryOptions } from "./get-discount-sellerId"

export const updatestatusDiscount = ({
  discountId,
}: {
  discountId: string
}) => {
  return api.patch(`/discountCode/active/${discountId}`)
}

export const useUpdateStatusDiscount = (
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
    mutationFn: updatestatusDiscount,
  })
}
