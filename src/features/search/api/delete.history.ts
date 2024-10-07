import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { getHistoryQueryOptions } from "@/features/search/api/get-history"

export const deleteHistory = ({ historyId }: { historyId: string }) => {
  return api.delete(`/searchHistory/${historyId}`)
}

type UseDeleteHistoryOptions = {
  userId?: string 
  page?: number
  limit?: number
}

export const useDeleteHistory = ({
  userId,
  ...args
}: UseDeleteHistoryOptions) => {
  const queryClient = useQueryClient()


  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getHistoryQueryOptions({ ...args,userId }).queryKey,
      })
    },
    mutationFn: deleteHistory,
  })
}
