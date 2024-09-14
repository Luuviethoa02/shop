import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { productRespose } from "@/types/api"
import { getCategoriesQueryOptions } from "./get-categories"

export const createCategory = ({
  data,
}: {
  data: FormData
}): Promise<productRespose> => {
  return api.post(`/brand/add`, data)
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCategoriesQueryOptions().queryKey,
      })
    },
    mutationFn: createCategory,
  })
}
