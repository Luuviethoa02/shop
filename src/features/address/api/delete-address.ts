import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { addressResponse } from "@/types/api"
import { getAddressQueryOptions } from "./get-address-user"

export const deleteAddress = ({
  addressId,
}: {
  addressId: string
}): Promise<addressResponse> => {
  return api.delete(`/address/delete/${addressId}`)
}

export const useDeleteAddress = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAddressQueryOptions({ userId }).queryKey,
      })
    },
    mutationFn: deleteAddress,
  })
}
