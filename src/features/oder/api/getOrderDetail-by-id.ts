import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { oderDetailSellerResponse, ResponseSuccess } from "@/types/api"
import { oderDetail } from "@/types/client"

type UseOrrderDetailOptions = {
    sellerId?: string
    orderDetailId?: string
}

export const getOderDetailBySellerId = ({
    sellerId,
    orderDetailId
}: {
    sellerId?: string
    orderDetailId?: string
}): Promise<ResponseSuccess<oderDetail[]>> => {
    return api.get(`/oder/getOrderDetailById/${sellerId}/${orderDetailId}`)
}

export const getOrderDetailByIdQueryOptions = (
    {
        sellerId,
        orderDetailId
    }: {
        sellerId: string | undefined
        orderDetailId: string | undefined
    } = {
            sellerId: undefined,
            orderDetailId: undefined
        }
) => {
    return {
        queryKey: ["get-oder-detail-by-sellerId-and-id", sellerId, orderDetailId],
        queryFn: () => getOderDetailBySellerId({ sellerId: sellerId, orderDetailId: orderDetailId }),
        enabled: !!sellerId && !!orderDetailId,
    }
}

export const useGetOderDetailBySellerIdAndId = ({
    sellerId,
    orderDetailId
}: UseOrrderDetailOptions) => {
    return useQuery({
        ...getOrderDetailByIdQueryOptions({ sellerId, orderDetailId }),
    })
}
