import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { notifiedUserResponse } from "@/types/api"

type UseNotificationOptions = {
  page: number
  limit: number
  userId: string | undefined
  queryConfig?: QueryConfig<typeof getNotificationQueryOptions>
}

export const getNotificationByUserId = ({
  userId,
  page,
  limit,
}: {
  userId: string | undefined
  page: number | undefined
  limit: number | undefined
}): Promise<notifiedUserResponse> => {
  return api.get(`/comment/notifications/${userId}`, {
    params: {
      page,
      limit,
    },
  })
}

export const getNotificationQueryOptions = (
  {
    page,
    limit,
    userId,
  }: {
    page: number | undefined
    limit: number | undefined
    userId: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    userId: undefined,
  }
) => {
  return {
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationByUserId({ userId, page, limit }),
    enabled: !!userId,
  }
}

export const useNotificationByUserId = ({
  userId,
  page,
  limit,
  queryConfig,
}: UseNotificationOptions) => {
  return useQuery({
    ...getNotificationQueryOptions({ userId, page, limit }),
    ...queryConfig,
  })
}
