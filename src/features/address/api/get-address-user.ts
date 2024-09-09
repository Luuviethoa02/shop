import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { addressResponse } from "@/types/api"

type UseAddressOptions = {
  userId: string | undefined
  queryConfig?: QueryConfig<typeof getAddressQueryOptions>
}

export const getAddressUsserId = (
  userId: string | undefined
): Promise<addressResponse> => {
  return api.get(`/address/${userId}`)
}

export const getAddressQueryOptions = (
  { userId }: { userId: string | undefined } = { userId: undefined }
) => {
  return {
    queryKey: ["address", userId],
    queryFn: () => getAddressUsserId(userId),
    enabled: !!userId,
  }
}

export const useAddressByUserId = ({
  userId,
  queryConfig,
}: UseAddressOptions) => {
  return useQuery({
    ...getAddressQueryOptions({ userId }),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
