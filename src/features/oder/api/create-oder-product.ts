
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { productRespose } from "@/types/api"
import { OdersProduct } from "@/types/client"

// export type CreatePCommentInput = z.infer<typeof commentSchema>

export const createOder = ({
  data,
}: {
  data:{
    oder:OdersProduct['oder'],
    oderDetails:OdersProduct['oderDetails'][],
  } 
}): Promise<productRespose> => {
  return api.post(`/oder/add`, data)
}

export const useCreateOder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["create-oder"],
      })
    },
    mutationFn: createOder,
  })
}
