import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import {
  UseGetAllSellersOptions,
} from "./get-all-sellers"
import { ResponseSuccess } from "@/types/api"
import { Seller, User } from "@/types/client"
import { getShopQueryOptions } from "./get-shop-by-slug"

export const updateInfoSellers = ({
  sellerId,
  data
}: {
  sellerId: string
  data:FormData
}): Promise<ResponseSuccess<Seller & { user: User }>> => {
  return api.patch(`/seller/updateInfo/${sellerId}`, data)
}

export const useUpdateInfoSeller = ({ ...args }: UseGetAllSellersOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getShopQueryOptions({ ...args }).queryKey,
      })
    },
    mutationFn: updateInfoSellers,
  })
}
