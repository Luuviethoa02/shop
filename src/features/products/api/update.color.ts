import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { getProductsQueryOptions } from "./get-sellerIdProduct"
import { productRespose } from "@/types/api"

const formColorSchema = z.object({
  name:z.string().optional(),
  quantity:z.string().optional()
})
 
export type UpdateColorInput = z.infer<typeof formColorSchema>

export const updateColor = ({
  data,
  colorEditId,
}: {
  data: FormData
  colorEditId: string
}): Promise<productRespose> => {
  return api.put(`/product/color/${colorEditId}`, data)
}

type UseUpdateColorOptions = {
  mutationConfig?: MutationConfig<typeof updateColor>
  page?: number
  limit?: number
  sellerId: string
}

export const useUpdateColorText = (
  { mutationConfig, page, limit, sellerId }: UseUpdateColorOptions = {
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
    mutationFn: updateColor,
  })
}
