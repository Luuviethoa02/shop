import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { sellerResponse } from "@/types/api"


export const uncreateFollower = ({
  data,
}: {
  data: {
    userId:string;
    sellerId:string;
  }
}): Promise<sellerResponse> => {
  return api.patch(`/seller/unfollower`, data)
}

export const useUnCreateFollower = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["un-follower-create"],
      })
    },
    mutationFn: uncreateFollower
  })
}
