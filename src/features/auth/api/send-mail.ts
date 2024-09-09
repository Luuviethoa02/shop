import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { MutationConfig } from "@/lib/react-query"
import { formSchemaforgotPassword } from "../validators"

export type CreateMailInput = z.infer<typeof formSchemaforgotPassword>

export const createMail = ({
  data,
}: {
  data: CreateMailInput
}): Promise<any> => {
  return api.post(`/auth/mail`, data)
}

type UseCreateMailOptions = {
  mutationConfig?: MutationConfig<typeof createMail>
}

export const useCreateMail = ({
  mutationConfig,
}: UseCreateMailOptions = {}) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["query", "mail"],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: createMail,
  })
}
