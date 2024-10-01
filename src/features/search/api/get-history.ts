import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { commentsResponse, historyResponse } from "@/types/api"

type UseCommentsOptions = {
    page: number
    limit: number
    userId: string | undefined
    queryConfig?: QueryConfig<typeof getHistoryQueryOptions>
}

export const getHistoryByUserId = ({
    userId,
    page,
    limit,
}: {
    userId: string | undefined
    page: number | undefined
    limit: number | undefined
}): Promise<historyResponse> => {
    return api.get(`/searchHistory/getAll/${userId}`, {
        params: {
            page,
            limit,
        },
    })
}

export const getHistoryQueryOptions = (
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
        queryKey: ["get-all-history", page, limit, userId],
        queryFn: () => getHistoryByUserId({ userId, page, limit }),
        enabled: !!userId,
    }
}

export const useGetHistoryByUserId = ({
    userId,
    page,
    limit,
    queryConfig,
}: UseCommentsOptions) => {
    return useQuery({
        ...getHistoryQueryOptions({ userId, page, limit }),
        ...queryConfig,
    })
}
