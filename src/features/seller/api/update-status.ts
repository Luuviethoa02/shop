import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import {
  getAllSellersQueryOptions,
  UseGetAllSellersOptions,
} from "./get-all-sellers"
import { ResponseSuccess } from "@/types/api"
import { Seller, User } from "@/types/client"

export const updateStatusSellers = ({
  status,
  sellerId,
}: {
  status: "rejected" | "finished"
  sellerId: string
}): Promise<ResponseSuccess<Seller & { user: User }>> => {
  return api.patch(`/seller/update/${sellerId}`, {
    status,
  })
}

export const useUpdateStatusSeller = ({ ...args }: UseGetAllSellersOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllSellersQueryOptions({ ...args }).queryKey,
      })
    },
    mutationFn: updateStatusSellers,
  })
}
