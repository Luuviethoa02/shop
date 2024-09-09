import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { productRespose } from "@/types/api"
import { schemaAddress } from "../validator"
import { getAddressQueryOptions } from "./get-address-user"

export type CreateAddressInput = z.infer<typeof schemaAddress>

export const createAddress = ({
  data,
}: {
  data: CreateAddressInput & { userId: string }
}): Promise<productRespose> => {
  return api.post(`/address/add`, data)
}

type UseCreateAddressOptions = {
  mutationConfig?: MutationConfig<typeof createAddress>
  userId: string | undefined
}

export const useCreateAddress = (
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
    mutationFn: createAddress,
  })
}
