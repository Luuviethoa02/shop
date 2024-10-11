import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { sellerResponse } from "@/types/api"

export const createFollower = ({
  data,
}: {
  data: {
    userId: string
    sellerId: string
  }
}): Promise<sellerResponse> => {
  return api.patch(`/seller/follower`, data)
}

export const useCreateFollower = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follower-create"],
      })
    },
    mutationFn: createFollower,
  })
}
