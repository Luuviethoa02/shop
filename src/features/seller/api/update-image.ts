import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import {
  getAllSellersQueryOptions,
  UseGetAllSellersOptions,
} from "./get-all-sellers"
import { ResponseSuccess } from "@/types/api"
import { Seller, User } from "@/types/client"

export const updateImageSellers = ({
  sellerId,
  data
}: {
  sellerId: string
  data:FormData
}): Promise<ResponseSuccess<Seller & { user: User }>> => {
  return api.patch(`/seller/updateLogo/${sellerId}`, data)
}

export const useUpdateImageSeller = ({ ...args }: UseGetAllSellersOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllSellersQueryOptions({ ...args }).queryKey,
      })
    },
    mutationFn: updateImageSellers,
  })
}
