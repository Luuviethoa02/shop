import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { productRespose } from "@/types/api"
import { getAddressQueryOptions } from "./get-address-user"

const schemaAddressDefault = z.object({
    addressId: z.string(),
})

export type SetaddressDefaultInput = z.infer<typeof schemaAddressDefault>

export const setAddressDefault = ({
  data,
}: {
  data: SetaddressDefaultInput
}): Promise<productRespose> => {
  return api.put(`/address/default`, data)
}

type UseCreateAddressOptions = {
  mutationConfig?: MutationConfig<typeof setAddressDefault>
  userId: string | undefined
}

export const useSetAddress = (
  { mutationConfig, userId }: UseCreateAddressOptions = { userId: undefined }
) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getAddressQueryOptions({ userId }).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: setAddressDefault,
  })
}
