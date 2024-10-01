import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { notifiedUserResponse, oderResponse } from "@/types/api"

type UseNotificationOptions = {
    page: number
    limit: number
    userId: string | undefined
    status_pay: string | undefined,
    queryConfig?: QueryConfig<typeof getNotificationQueryOptions>
}

export const getOderByUserId = ({
    userId,
    page,
    status_pay,
    limit,
}: {
    userId: string | undefined
    page: number | undefined
    limit: number | undefined
    status_pay: string | undefined,
}): Promise<oderResponse> => {
    return api.get(`/oder/getAll/${userId}`, {
        params: {
            page,
            limit,
            status_pay,
        },
    })
}

export const getNotificationQueryOptions = (
    {
        page,
        limit,
        userId,
        status_pay
    }: {
        page: number | undefined
        limit: number | undefined
        userId: string | undefined
        status_pay: string | undefined
    } = {
            page: undefined,
            limit: undefined,
            userId: undefined,
            status_pay: undefined
        }
) => {
    return {
        queryKey: ["get-oder", userId, page, limit, status_pay],
        queryFn: () => getOderByUserId({ userId, page, limit, status_pay }),
        enabled: !!userId,
    }
}

export const useGetOderByUserId = ({
    userId,
    page,
    limit,
    status_pay,
    queryConfig,
}: UseNotificationOptions) => {
    return useQuery({
        ...getNotificationQueryOptions({ userId, page, limit, status_pay }),
        ...queryConfig,
    })
}
