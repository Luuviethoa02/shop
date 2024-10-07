import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseSuccess } from "@/types/api"

type UsehistoryOptions = {
  page?: number
  limit?: number
  userId?: string
}

export const getHistoryByUserId = ({
  userId,
  ...args
}: UsehistoryOptions): Promise<
  ResponseSuccess<
    { _id: string; count: number; relativeTime: string; keyWords: string }[]
  >
> => {
  return api.get(`/searchHistory/getAll/${userId}`, {
    params: {
      ...args,
    },
  })
}

export const getHistoryQueryOptions = ({
  userId,
  ...args
}: UsehistoryOptions) => {
  return {
    queryKey: ["get-all-history", userId, { ...args }],
    queryFn: () => getHistoryByUserId({ userId, ...args }),
    enabled: !!userId,
  }
}

export const useGetHistoryByUserId = ({
  userId,
  ...args
}: UsehistoryOptions) => {
  return useQuery({
    ...getHistoryQueryOptions({ userId, ...args }),
  })
}
