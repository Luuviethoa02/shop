import { api } from "@/lib/api-client";
import { orderNotifiCationResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrderNotificationQueryOptions } from "./order-notification";

const deleteStatusOrder = (notifiId: string): Promise<orderNotifiCationResponse> => {
    return api.delete(`/orderNotification/orderNotifications/${notifiId}`)
}

export const useDeletesOrderNotification = (sellerId: string | undefined, page: number, limit: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteStatusOrder,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: getOrderNotificationQueryOptions({
                    page,
                    limit,
                    sellerId
                }).queryKey
            })

        },
    })
}