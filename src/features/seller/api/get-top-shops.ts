import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseData, ResponseSuccess, topSellers } from "@/types/api"

export type UseGetTopSellersOptions = {
    limit?: number
}

export const getTopSellers = ({
    ...agrs
}: UseGetTopSellersOptions): Promise<ResponseSuccess<topSellers[]>> => {
    return api.get(`/seller/topshops`, {
        params: {
            ...agrs,
        },
    })
}

export const getTopSellersQueryOptions = ({
    ...agrs
}: UseGetTopSellersOptions) => {
    return {
        queryKey: ["get-top-shops", { ...agrs }],
        queryFn: () => getTopSellers({ ...agrs }),
    }
}

export const useGetTopSellers = ({ ...args }: UseGetTopSellersOptions) => {
    return useQuery({
        ...getTopSellersQueryOptions({ ...args }),
    })
}
