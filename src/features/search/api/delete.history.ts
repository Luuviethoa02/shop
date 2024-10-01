import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"
import { getHistoryQueryOptions } from "@/features/search/api/get-history"


export const deleteHistory = ({ historyId }: { historyId: string }) => {
  return api.delete(`/searchHistory/${historyId}`)
}

type UseDeleteHistoryOptions = {
  userId: string | undefined
  page: number
  limit: number
  mutationConfig?: MutationConfig<typeof deleteHistory>
}

export const useDeleteHistory = ({
  mutationConfig,
  page,
  limit,
  userId,
}: UseDeleteHistoryOptions) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getHistoryQueryOptions({ page, limit, userId }).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: deleteHistory,
  })
}
