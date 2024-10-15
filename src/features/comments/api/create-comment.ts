import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"

import { productRespose } from "@/types/api"
import { commentSchema } from "../validators"

export type CreatePCommentInput = z.infer<typeof commentSchema>

export const createComments = ({
  data,
}: {
  data: FormData
}): Promise<productRespose> => {
  return api.post(`/comment/add`, data)
}

type UseCreateCommentOptions = {
  mutationConfig?: MutationConfig<typeof createComments>
}

export const useCreateComment = ({
  mutationConfig,
}: UseCreateCommentOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: createComments,
  })
}
