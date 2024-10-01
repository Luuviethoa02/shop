import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { addressResponse } from "@/types/api"
import { getAddressQueryOptions } from "./get-address-user"
import { address } from "@/types/client"

type addressAdd = Omit<address,'_id' | 'default' | 'user_id'>

export const updateAddress = ({
    data,
    addressId,
}: {
    data: Partial<addressAdd>
    addressId: string
}): Promise<addressResponse> => {
    return api.patch(`/address/update/${addressId}`, data)
}

export const useUpdateAddressText = ({ userId }: { userId: string }) => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getAddressQueryOptions({ userId })
                    .queryKey,
            })
        },
        mutationFn: updateAddress,
    })
}
