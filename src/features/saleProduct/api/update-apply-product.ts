import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { productRespose } from "@/types/api"
import { getDiscountQueryOptions } from "./get-discount-sellerId"

const formColorSchema = z.object({
  productIds: z.any().array(),
})

export type UpdateDiscountProduct = z.infer<typeof formColorSchema>

export const updateDiscount = ({
  data,
  discountId,
}: {
  data: {
    productIds: string[]
  }
  discountId: string
}): Promise<productRespose> => {
  return api.put(`/discountCode/product/add/${discountId}`, data)
}

type UseUpdateDiscountOptions = {
  mutationConfig?: MutationConfig<typeof updateDiscount>
  page?: number
  limit?: number
  sellerId: string
}

export const useUpdateDiscount = (
  { mutationConfig, page, limit, sellerId }: UseUpdateDiscountOptions = {
    page: 0,
    limit: 0,
    sellerId: "",
  }
) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscountQueryOptions({ limit, page, sellerId }).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: updateDiscount,
  })
}
