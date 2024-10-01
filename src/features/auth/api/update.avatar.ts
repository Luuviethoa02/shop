import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { updateUserResponse} from "@/types/api"
import { getUsersQueryOptions } from "./get-user"


export const updateAvatar = ({
    data,
    userId,
}: {
    data: FormData
    userId: string
}): Promise<updateUserResponse> => {
    return api.patch(`/auth/avatar/${userId}`, data)
}

export const useUpdateAvartarUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getUsersQueryOptions()
                    .queryKey,
            })
        },
        mutationFn: updateAvatar,
    })
}
