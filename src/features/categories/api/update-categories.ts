import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

import { productRespose } from "@/types/api"
import { getCategoriesQueryOptions } from "./get-categories"

export const updateCategory = ({
  data,
  categoryId,
}: {
  data: FormData
  categoryId: string
}): Promise<productRespose> => {
  return api.patch(`/brand/update/${categoryId}`, data)
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCategoriesQueryOptions().queryKey,
      })
    },
    mutationFn: updateCategory,
  })
}
