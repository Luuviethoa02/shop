import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { sellerResponse } from "@/types/api"
import { schemaSeller } from "../validators"

export type CreateSeller = z.infer<typeof schemaSeller>

export const createSeller = ({
  data,
}: {
  data: CreateSeller
}): Promise<sellerResponse> => {
  return api.post(`/seller/add`, data)
}

type UseCreateSellerOptions = {
  mutationConfig?: MutationConfig<typeof createSeller>
}

export const useCreateSeller = ({
  mutationConfig,
}: UseCreateSellerOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["seller-create"],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: createSeller,
  })
}
