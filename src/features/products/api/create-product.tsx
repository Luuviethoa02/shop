import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { formProductSchema } from "../validators"
import { getProductsQueryOptions } from "./get-sellerIdProduct"
import { productRespose } from "@/types/api"

export type CreateProductInput = z.infer<typeof formProductSchema>

export const createProduct = ({
  data,
}: {
  data: FormData
}): Promise<productRespose> => {
  return api.post(`/product/add`, data)
}

type UseCreateProductOptions = {
  mutationConfig?: MutationConfig<typeof createProduct>
  page?: number
  limit?: number
  sellerId: string
}

export const useCreateProduct = (
  { mutationConfig, page, limit, sellerId }: UseCreateProductOptions = {
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
        queryKey: getProductsQueryOptions({ limit, page, sellerId }).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: createProduct,
  })
}
