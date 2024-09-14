import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { productRespose } from "@/types/api"
import { getProductsQueryOptions } from "./get-sellerIdProduct"

export const updateProduct = ({
  data,
  productId,
}: {
  data: FormData
  productId: string
}): Promise<productRespose> => {
  return api.patch(`/product/update/${productId}`, data)
}

export const useUpdateProductText = (
  {
    page,
    limit,
    sellerId,
    status,
  }: {
    sellerId: string
    page: number | undefined
    limit: number | undefined
    status: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    sellerId: "",
    status: undefined,
  }
) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProductsQueryOptions({ page, limit, sellerId, status })
          .queryKey,
      })
    },
    mutationFn: updateProduct,
  })
}
