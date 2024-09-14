import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { productRespose } from "@/types/api"
import { getProductsQueryOptions } from "./get-sellerIdProduct"

export const deleteProduct = ({
  productId,
}: {
  productId: string
}): Promise<productRespose> => {
  return api.delete(`/product/delete/${productId}`)
}

export const useDeleteProduct = (
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
    mutationFn: deleteProduct,
  })
}
